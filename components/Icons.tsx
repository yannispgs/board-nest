import { View } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import EvilIcons from '@expo/vector-icons/EvilIcons';

type IconProps = {
  size?: number;
  color?: string;
};

export function EditIcon({ size = 20, color = '#000' }: IconProps) {
  return <EvilIcons name="pencil" size={size} color={color} />;
}

export function DeleteIcon({ size = 20, color = '#000' }: IconProps) {
  return <Ionicons name="trash-outline" size={size} color={color} />;
}

type BoardgameIconProps = {
  boardgame: string;
  className?: string;
};

const boardgameIconMapping: { [key: string]: any } = {
  Catan: require('~/assets/icons/boardgames/catan.png'),
  Scythe: require('~/assets/icons/boardgames/scythe.png'),
  'Terraforming Mars': require('~/assets/icons/boardgames/terraforming_mars.png'),
};

export default function BoardgameIcon({
  boardgame,
  className = 'h-10 w-10',
}: BoardgameIconProps) {
  return (
    <View className={className}>
      <Image
        source={boardgameIconMapping[boardgame]}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
