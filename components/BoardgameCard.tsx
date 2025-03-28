import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import BoardgameIcon from './BoardgameIcon';

type Props = {
  boardgame: string;
};

export default function BoardgameCard({ boardgame }: Props) {
  return (
    <Link href={`/boardgames/${boardgame}`}>
      <View className="flex h-14 flex-row items-center border-b-2 border-b-[#b9c0f0]">
        <BoardgameIcon
          boardgame={boardgame}
          className="m-2 mr-3 h-10 w-10 flex-none"
        />
        <Text className="flex-1 text-wrap text-justify">{boardgame}</Text>
      </View>
    </Link>
  );
}
