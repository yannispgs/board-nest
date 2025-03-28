import { useQuery } from 'convex/react';
import { ScrollView } from 'react-native';

import { api } from '~/convex/_generated/api';
import GameCard from './GameCard';

/** TODO :
 * - Replace all Card List components by a generic CardList Component
 * - Sort by Date/Game/Player/Status
 * - Filter by Date/Game/Player/Status
 */

export default function GameCardList() {
  const games = useQuery(api.game.listPopulated, {});

  return (
    <ScrollView className="flex h-full flex-col border-2 border-[#0023f4]">
      {games?.map((game, i) => (
        <GameCard
          key={i}
          game={game}
          // onPress={() => {
          //   navigation.navigate('OngoingGameScreen', {
          //     gameId: game._id.toString(),
          //   });
          // }}
        />
      ))}
    </ScrollView>
  );
}
