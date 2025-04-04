import { useMutation, useQuery } from 'convex/react';
import { Audio } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  Button,
  ImageBackground,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import DropDownPicker from 'react-native-dropdown-picker';
import rotate from 'rotate-array';

import BoardgameIcon from '~/components/BoardgameIcon';
import InplaceModal from '~/components/InplaceModal';
import PlayerCarousel from '~/components/PlayerCarousel';
import { api } from '~/convex/_generated/api';
import type { Id } from '~/convex/_generated/dataModel';
import { GameStatuses } from '~/types';
import { TURN_DURATION } from '~/utils/env';

const beepSound = new Audio.Sound();
beepSound.loadAsync(require('~/assets/sounds/beep.mp3'));
beepSound.setVolumeAsync(0.65);

const ringSound = new Audio.Sound();
ringSound.loadAsync(require('~/assets/sounds/ring.mp3'));

const bgStyle = {
  paused: {
    opacity: 0.25,
  },
  playing: {
    opacity: 0,
  },
};

export default function GameDetails() {
  const { id: gameId } = useLocalSearchParams<{ id: string }>();

  const endPlayerTurnFunction = useMutation(api.game.endPlayerTurn);
  const endGameFunction = useMutation(api.game.endGame);
  const game = useQuery(api.game.getPopulated, {
    id: gameId as Id<'game'>,
  });

  // Update the Trigger to restart the timer
  // https://www.npmjs.com/package/react-native-countdown-circle-timer#restart-timer-at-any-given-time
  const [trigger, setTrigger] = useState(0);
  const [isTimerPlaying, setIsTimerPlaying] = useState(true);
  const [turnDuration, setTurnDuration] = useState(TURN_DURATION);
  const [currentTurnDuration, setCurrentTurnDuration] = useState(turnDuration);

  const [isClockUpdateModalVisible, setIsClockUpdateModalVisible] =
    useState(false);

  const [isGameEndModalVisible, setIsGameEndModalVisible] = useState(false);
  const [winnerPickerOpen, setWinnerPickerOpen] = useState(false);
  const [winnerPickerValue, setWinnerPickerValue] = useState('');
  const winnerPickerItems = game?.players.map((p) => ({
    label: p.name,
    value: p._id,
  }));

  if (!game) {
    return <Text>Game not found</Text>;
  }

  const handleTurnEnd = async () => {
    await endPlayerTurnFunction({ id: game._id });
    setTrigger(trigger + 1);
    setCurrentTurnDuration(turnDuration);
  };

  const handleTimerUpdate = (remainingTime: number) => {
    if (remainingTime <= 10) {
      beepSound.playFromPositionAsync(0);
    }
  };

  const handleTimerEnd = () => {
    ringSound.playFromPositionAsync(0);
  };

  const handleClockClick = () => {
    setIsTimerPlaying(!isTimerPlaying);
  };

  const handleClockLongPress = () => {
    setIsClockUpdateModalVisible(true);
  };

  const handleClockUpdateModalClose = () => {
    setIsClockUpdateModalVisible(false);
  };

  const handleGameEndModalOpen = () => {
    setIsGameEndModalVisible(true);
  };

  const handleGameEndModalClose = () => {
    setWinnerPickerValue('');
    setWinnerPickerOpen(false);

    setIsGameEndModalVisible(false);
  };

  const handleGameEnd = async (winner: Id<'player'>) => {
    await endGameFunction({ id: game._id, winner });

    handleGameEndModalClose();
  };

  const renderTime = (remainingTime: number): string => {
    if (remainingTime === 0) {
      return 'STOP';
    }

    return remainingTime.toString();
  };

  return (
    <View className="m-3 flex-1 flex-col justify-between">
      <View id="container-boardgame" className="flex-row justify-between">
        <View className="justify-center">
          <BoardgameIcon
            boardgame={game.boardgame.name}
            className="h-14 w-14"
          />
        </View>
        <View className="w-3/5 justify-center">
          <Text className="text-center text-3xl">{game.boardgame.name}</Text>
        </View>
        <View className="justify-center">
          <BoardgameIcon
            boardgame={game.boardgame.name}
            className="h-14 w-14"
          />
        </View>
      </View>
      {game.status === GameStatuses.ONGOING && (
        <>
          <View>
            <PlayerCarousel
              players={rotate(
                game.players.map((p) => p.name),
                Number(game.turn) - 1
              )}
            />
          </View>
          <TouchableOpacity
            className="self-center"
            onPress={handleClockClick}
            onLongPress={handleClockLongPress}>
            <ImageBackground
              source={require('~/assets/images/pause.png')}
              imageStyle={isTimerPlaying ? bgStyle.playing : bgStyle.paused}>
              <CountdownCircleTimer
                key={trigger}
                isPlaying={isTimerPlaying}
                duration={currentTurnDuration}
                colors={['#128700', '#C6C000', '#cf6800', '#A30000']}
                colorsTime={[
                  currentTurnDuration,
                  currentTurnDuration / 2,
                  currentTurnDuration / 4,
                  0,
                ]}
                onUpdate={handleTimerUpdate}
                onComplete={handleTimerEnd}>
                {({ remainingTime, color }) => (
                  <View className="h-3/5 flex-col justify-between">
                    <Text className="text-center text-base text-gray-600">
                      {game.currentPlayer?.name}
                    </Text>
                    <Text
                      className="value text-center text-4xl font-bold"
                      style={{ color }}>
                      {renderTime(remainingTime)}
                    </Text>
                    <Text className="text-center text-base text-gray-600">
                      seconds
                    </Text>
                  </View>
                )}
              </CountdownCircleTimer>
            </ImageBackground>
          </TouchableOpacity>

          <InplaceModal visible={isClockUpdateModalVisible} id="clock-update">
            <View className="flex-col justify-between gap-y-4">
              <View>
                <Text className="text-center text-lg">
                  Update the turn duration
                </Text>
              </View>
              <View className="flex-row justify-center">
                <TextInput
                  placeholder="seconds"
                  defaultValue={turnDuration.toString()}
                  onEndEditing={(e) =>
                    setTurnDuration(parseInt(e.nativeEvent.text, 10))
                  }
                />
                <Text className="text-small"> sec</Text>
              </View>
              <View className="flex-row justify-evenly">
                <View>
                  <Button
                    title="Close"
                    onPress={() => {
                      setTurnDuration(currentTurnDuration);
                      handleClockUpdateModalClose();
                    }}
                  />
                </View>
                <View>
                  <Button
                    title="Confirm"
                    disabled={turnDuration === currentTurnDuration}
                    onPress={handleClockUpdateModalClose}
                  />
                </View>
              </View>
            </View>
          </InplaceModal>

          <View id="button-container" className="flex-row justify-center">
            <TouchableOpacity
              className="h-10 justify-center rounded-full bg-gray-300 px-5"
              onPress={handleTurnEnd}>
              <Text className="text-center text-xl">Next player</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            {/* <View className="flex-col justify-center">
              <View className="flex-row">
                <Text className="text-small">Turn duration = </Text>
                <View className="w-auto">
                  <TextInput
                    className="flex-1 py-[0]"
                    placeholder="seconds"
                    defaultValue={turnDuration.toString()}
                    onEndEditing={(e) =>
                      setTurnDuration(parseInt(e.nativeEvent.text, 10))
                    }
                  />
                </View>
                <Text className="text-small"> sec</Text>
              </View>
            </View> */}
            <View>
              <TouchableOpacity
                className="h-10 justify-center rounded-md bg-green-400 px-5"
                onPress={handleGameEndModalOpen}>
                <Text className="text-center text-xl">End game</Text>
              </TouchableOpacity>
            </View>
          </View>
          <InplaceModal visible={isGameEndModalVisible} id="game-end">
            <View className="flex-col justify-between gap-y-4">
              <View>
                <Text className="text-center text-lg">Who is the winner ?</Text>
              </View>
              <View>
                <DropDownPicker
                  placeholder="Select the winner"
                  open={winnerPickerOpen}
                  items={winnerPickerItems!}
                  value={winnerPickerValue}
                  setOpen={setWinnerPickerOpen}
                  setValue={setWinnerPickerValue}
                  closeAfterSelecting={true}
                />
              </View>
              <View className="flex-row justify-evenly">
                <View>
                  <Button title="Close" onPress={handleGameEndModalClose} />
                </View>
                <View>
                  <Button
                    title="Confirm"
                    onPress={() =>
                      handleGameEnd(winnerPickerValue as Id<'player'>)
                    }
                    disabled={winnerPickerValue === ''}
                  />
                </View>
              </View>
            </View>
          </InplaceModal>
        </>
      )}
      {game.status === GameStatuses.ENDED && (
        <View className="flex-col items-center justify-center">
          <Text className="text-center text-3xl">Congratulations to</Text>
          <Text className="py-8 text-center text-6xl font-bold">
            {game.winner?.name}
          </Text>
          <Text className="text-center text-3xl">for winning this game !</Text>
        </View>
      )}
      <View id="footer-turn" className="">
        <Text className="text-center text-xl">
          Round - {Number(game.round)}
        </Text>
        <Text className="text-center text-sm italic">
          {new Date(game.startDate).toLocaleString('fr-FR')}
        </Text>
      </View>
    </View>
  );
}
