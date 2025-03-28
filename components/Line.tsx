import { DimensionValue, View } from 'react-native';

export default function Line({ width = '100%', color = 'black' }) {
  const lineStyle = {
    width: width as DimensionValue,
    height: 1,
    alignSelf: 'auto' as const,
    backgroundColor: color,
  };
  return <View style={lineStyle} />;
}
