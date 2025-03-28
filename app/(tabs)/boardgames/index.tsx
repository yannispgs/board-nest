import { useQuery } from 'convex/react';
import { ScrollView, View } from 'react-native';

import BoardgameCard from '~/components/BoardgameCard';
import { api } from '~/convex/_generated/api';

export default function BoardgamesHome() {
  const boardgames = useQuery(api.boardgame.list, {});

  return (
    <View className="m-2">
      <ScrollView className="h-full flex-col overflow-scroll border-2 border-[#0023f4]">
        {boardgames?.map((boardgame) => {
          return (
            <BoardgameCard key={boardgame.name} boardgame={boardgame.name} />
          );
        })}
      </ScrollView>
    </View>
  );
}
