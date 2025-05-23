import { useConvex, useMutation, useQuery } from 'convex/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

import GameCardList from '~/components/GameCardList';
import InplaceModal from '~/components/InplaceModal';
import { api } from '~/convex/_generated/api';

const cardBadgeFontSize = 12;

export default function GamesHome() {
  const convex = useConvex();

  const createGame = useMutation(api.game.create);
  const router = useRouter();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const [gamePickerOpen, setGamePickerOpen] = useState(false);
  const [gamePickerValue, setGamePickerValue] = useState('');
  const gamePickerItems = useQuery(api.boardgame.list, {})?.map(
    (boardgame) => ({
      label: boardgame.name,
      value: boardgame.name,
    })
  );

  const [configPickerOpen, setConfigPickerOpen] = useState(false);
  const [configPickerValue, setConfigPickerValue] = useState('Default');
  const allConfigs = useQuery(api.config.all.list, {})?.map((config) => ({
    label: config.name,
    value: config.name,
    boardgame: config.boardgame,
  }));
  const configPickerItems = allConfigs?.filter(
    (config) => config.boardgame === gamePickerValue
  );

  const [playerPickerOpen, setPlayerPickerOpen] = useState(false);
  const [playerPickerValue, setPlayerPickerValue] = useState([]);
  const playerPickerItems = useQuery(api.player.list, {})?.map((player) => ({
    label: player.name,
    value: player.name,
  }));

  const handleGameCreation = async () => {
    try {
      const newGameId = await createGame({
        boardgame: (await convex.query(api.boardgame.get, {
          name: gamePickerValue,
        }))!._id,
        players: await Promise.all(
          playerPickerValue.map(
            async (playerName) =>
              (await convex.query(api.player.get, { name: playerName }))!._id
          )
        ),
        config: (await convex.query(api.config.all.get, {
          boardgame: gamePickerValue,
          name: configPickerValue,
        }))!._id,
      });

      router.push(`/games/${newGameId}`);
    } catch (error) {
      console.error(error);
    }

    handleModalClose();
  };

  const handleModalOpen = () => {
    if (!gamePickerItems || !playerPickerItems) {
      Alert.alert('You need to create a player and a boardgame first');
      return;
    }

    setIsCreateModalVisible(true);
  };

  const handleModalClose = () => {
    setGamePickerValue('');
    setGamePickerOpen(false);

    setConfigPickerValue('Default');
    setConfigPickerOpen(false);

    setPlayerPickerValue([]);
    setPlayerPickerOpen(false);

    setIsCreateModalVisible(false);
  };

  return (
    <View className="flex h-full flex-col">
      <View className="mx-2 mt-2 h-5/6">
        <GameCardList />
      </View>

      <View className="h-1/6 items-center justify-center">
        <TouchableOpacity
          onPress={handleModalOpen}
          className="rounded-full bg-[#0023f4] px-2">
          <Text className="px-2 py-1 text-lg text-white">New Game</Text>
        </TouchableOpacity>
      </View>

      <InplaceModal visible={isCreateModalVisible}>
        <View className="h-[375] flex-col justify-between">
          <View id="picker-boardgame" className="z-30 flex-none">
            <Text className="mb-2 text-center text-lg">Boardgame</Text>
            <DropDownPicker
              placeholder="Pick a board game"
              open={gamePickerOpen}
              items={gamePickerItems!}
              value={gamePickerValue}
              setOpen={setGamePickerOpen}
              onOpen={() => {
                setConfigPickerOpen(false);
                setPlayerPickerOpen(false);
              }}
              setValue={setGamePickerValue}
              dropDownDirection="BOTTOM"
              closeAfterSelecting={true}
            />
          </View>

          <View id="picker-config" className="z-20 flex-none">
            <Text className="mb-2 mt-6 text-center text-lg">Config</Text>
            {(configPickerItems?.length === 0 && (
              <Text className="text-center text-sm text-red-500">
                No config available for this boardgame
              </Text>
            )) || (
              <DropDownPicker
                placeholder="Select the config"
                open={configPickerOpen}
                items={configPickerItems!}
                value={configPickerValue}
                setOpen={setConfigPickerOpen}
                onOpen={() => {
                  setGamePickerOpen(false);
                  setPlayerPickerOpen(false);
                }}
                setValue={setConfigPickerValue}
                dropDownDirection="BOTTOM"
              />
            )}
          </View>

          <View id="picker-players" className="z-100 flex-1">
            <Text className="mb-2 mt-6 text-center text-lg">Player(s)</Text>
            <DropDownPicker
              placeholder="Select the player(s)"
              multiple={true}
              min={1}
              mode="BADGE"
              showBadgeDot={false}
              extendableBadgeContainer={true}
              badgeTextStyle={{ fontSize: cardBadgeFontSize }}
              open={playerPickerOpen}
              items={playerPickerItems!}
              value={playerPickerValue}
              setOpen={setPlayerPickerOpen}
              onOpen={() => {
                setConfigPickerOpen(false);
                setGamePickerOpen(false);
              }}
              setValue={setPlayerPickerValue}
              dropDownDirection="BOTTOM"
            />
          </View>

          <View className="w-100% z-10 flex-row justify-evenly">
            <Button title="Close" onPress={handleModalClose} />
            <Button
              title="Create"
              onPress={handleGameCreation}
              disabled={
                playerPickerValue.length === 0 || gamePickerValue === ''
              }
            />
          </View>
        </View>
      </InplaceModal>
    </View>
  );
}
