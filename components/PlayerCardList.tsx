import { useQuery } from 'convex/react';
import { ScrollView } from 'react-native';

import { api } from '~/convex/_generated/api';
import PlayerCard from './PlayerCard';

export default function PlayerCardList() {
  const players = useQuery(api.player.list, {});

  return (
    <ScrollView className="flex h-full flex-col overflow-scroll border-2 border-[#0023f4]">
      {players?.map((player) => (
        <PlayerCard key={player.name} name={player.name} />
      ))}
    </ScrollView>
  );
}
