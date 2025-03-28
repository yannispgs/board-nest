import { Image } from 'react-native';

type Props = {
  boardgame: string;
  className?: string;
};

const boardgameIconMapping: { [key: string]: any } = {
  Catan: require('../assets/icons/boardgames/catan.png'),
  Scythe: require('../assets/icons/boardgames/scythe.png'),
  'Terraforming Mars': require('../assets/icons/boardgames/terraforming_mars.png'),
};

export default function BoardgameIcon({
  boardgame,
  className = 'h-10 w-10',
}: Props) {
  return (
    <Image source={boardgameIconMapping[boardgame]} className={className} />
  );
}
