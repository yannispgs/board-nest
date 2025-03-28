import { generateColorRGB } from '@marko19907/string-to-color';
import parse from 'color-parse';
import { Text, View } from 'react-native';

import { getInitials } from '~/utils';

/* TODO :
 * - arrondir les cercles (sur Android on voit les angles pour les couleurs foncées)
 **/

type Props = {
  name: string;
};

export default function PlayerAvatar({ name }: Props) {
  const avatarBgColor = generateColorRGB(name);
  const { values } = parse(avatarBgColor);
  // Compute the contrast color for the text between black or white
  const avatarTextColor =
    values[0] * 0.299 + values[1] * 0.587 + values[2] * 0.114 > 186
      ? '#000000'
      : '#FFFFFF';

  return (
    <View
      className="m-2 flex h-10 w-10 flex-none items-center justify-center rounded-full"
      style={{
        backgroundColor: avatarBgColor,
      }}>
      <Text
        className="text-white"
        style={{
          color: avatarTextColor,
        }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
