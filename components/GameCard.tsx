import { Link } from 'expo-router';
import { Text, View } from 'react-native';

import { PopulatedGame } from '~/convex/models';
import { GameStatuses } from '~/types';
import BoardgameIcon from '~/components/Icons';

type Props = {
  game: PopulatedGame;
};

const circleColor = (status: string) => {
  switch (status) {
    case GameStatuses.ONGOING:
      return 'green';
    case GameStatuses.ENDED:
      return 'black';
    default:
      return 'red';
  }
};

export default function GameCard({ game }: Props) {
  return (
    <Link href={`/games/${game._id.toString()}`}>
      <View className="flex flex-row items-center border-b-2 border-b-[#b9c0f0] py-1">
        <View
          className="ml-1 mr-0.5 h-3 w-3 rounded-full"
          style={{
            backgroundColor: circleColor(game.status),
          }}
        />
        <BoardgameIcon
          boardgame={game.boardgame.name}
          className="m-1 mr-3 h-10 w-10 flex-none"
        />
        <Text className="flex text-wrap">{game.boardgame.name}</Text>
        <View className="flex flex-col gap-y-1 px-4">
          <Text className="text-center text-xs italic">
            {game.winner
              ? `${game.status.toUpperCase()} - ${game.winner.name}`
              : game.status.toUpperCase()}
          </Text>
          <Text className="text-center">
            {new Date(game.startDate).toLocaleDateString()}
          </Text>
        </View>
        <Text className="w-1/3 flex-1 text-pretty pr-1 text-center">
          {game.players.map((player) => player.name).join(' - ')}
        </Text>
      </View>
    </Link>
  );
}
