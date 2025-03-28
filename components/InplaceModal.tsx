import { Modal, View } from 'react-native';

type Props = {
  visible: boolean;
  children: React.ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  [key: string]: any;
};

const shadowStyle = {
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
};

export default function InplaceModal({
  visible,
  children,
  animationType = 'slide',
  ...props
}: Props) {
  return (
    <Modal
      visible={visible}
      animationType={animationType}
      transparent={true}
      {...props}>
      <View className="flex-1 items-center justify-center">
        <View
          className="w-2/3 items-center rounded-2xl bg-white p-4"
          style={shadowStyle}>
          {children}
        </View>
      </View>
    </Modal>
  );
}
