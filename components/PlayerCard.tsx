import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Button, Image, Text, TouchableOpacity, View } from 'react-native';

import InplaceModal from '~/components/InplaceModal';
import { api } from '~/convex/_generated/api';
import PlayerAvatar from './PlayerAvatar';

type Props = {
  name: string;
};

export default function PlayerCard({ name }: Props) {
  const player = useQuery(api.player.get, { name });
  const removePlayer = useMutation(api.player.remove);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const deletePlayer = () => {
    removePlayer({ id: player!._id });

    setIsDeleteModalVisible(false);
  };

  const resetPlayerDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  return (
    <View className="flex h-14 flex-row items-center border-b-2 border-b-[#b9c0f0]">
      <PlayerAvatar name={name} />
      <Text className="flex-1 text-wrap text-justify">{name}</Text>
      <View className="mr-[1] h-full flex-col justify-center">
        <TouchableOpacity
          onPress={() => setIsDeleteModalVisible(true)}
          className="h-6 w-6 items-center justify-center bg-gray-100">
          <Image
            source={require('~/assets/icons/delete.png')}
            className="h-5 w-5"
          />
        </TouchableOpacity>
      </View>

      <InplaceModal visible={isDeleteModalVisible}>
        <Text className="text-center text-sm">
          {`Are you sure you want to delete the player '${name}' ?`}
        </Text>
        <Text className="mt-4 text-center text-sm font-bold">{`This action is irreversible.`}</Text>
        <View className="mt-2 w-full flex-row justify-evenly">
          <Button title="Delete" onPress={deletePlayer} />
          <Button title="Cancel" onPress={resetPlayerDeleteModal} />
        </View>
      </InplaceModal>
    </View>
  );
}
