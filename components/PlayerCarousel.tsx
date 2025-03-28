// import LinearGradient from 'react-native-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

type Props = {
  players: string[];
};

export default function PlayerCarousel({ players }: Props) {
  const firstPlayerNameStyle = {
    fontWeight: 'bold' as const,
  };
  return (
    <View className="mx-1 w-full overflow-hidden">
      <LinearGradient
        start={{ x: 0.2, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={['rgba(240, 240, 240, 0)', 'rgba(240, 240, 240, 1)']}
        locations={[0, 0.75]}
        className="absolute z-20 h-8 w-full"
      />
      <View className="z-10 flex-row justify-start gap-x-2">
        {players.map((player, i) => (
          <View key={player + ''} className="flex-row">
            <Text
              key={player + '-name'}
              className="mr-2 text-xl"
              style={i === 0 ? firstPlayerNameStyle : {}}>
              {player}
            </Text>
            <Text key={player + '-arrow'} className="text-xl">
              &gt;
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
