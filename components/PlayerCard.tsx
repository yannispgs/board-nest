import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import InplaceModal from '~/components/InplaceModal';
import { DeleteIcon, EditIcon } from '~/components/Icons';
import { api } from '~/convex/_generated/api';
import PlayerAvatar from './PlayerAvatar';

type Props = {
  name: string;
};

export default function PlayerCard({ name }: Props) {
  const player = useQuery(api.player.get, { name });
  const removePlayer = useMutation(api.player.remove);
  const updatePlayer = useMutation(api.player.update);

  const [activeModal, setActiveModal] = useState<null | 'update' | 'delete'>(
    null
  );
  const [newName, setNewName] = useState('');
  const [nameExists, setNameExists] = useState(false);

  const handleNewNameChange = (text: string) => {
    setNewName(text);
    if (nameExists) {
      setNameExists(false);
    }
  };

  const handleUpdateModalOpen = () => {
    setActiveModal('update');
    setNewName(player ? player.name : '');
  };

  const handleUpdateModalClose = async () => {
    try {
      await updatePlayer({ id: player!._id, newName });
      setActiveModal(null);
    } catch (error) {
      if (
        /A player with this name already exists/.test((error as Error).message)
      ) {
        setNameExists(true);
      } else {
        console.error('Error deleting player:', error);
        Alert.alert(
          'Unknown error',
          'An unknown error has occurred. Check the console logs to have more details.'
        );
      }
    }
  };

  const handleUpdateModalReset = () => {
    setActiveModal(null);
  };

  const handleDeleteModalOpen = () => {
    setActiveModal('delete');
  };

  const handleDeleteModalClose = async () => {
    await removePlayer({ id: player!._id });
    setActiveModal(null);
  };

  const handleDeleteModalReset = () => {
    setActiveModal(null);
  };

  return (
    <View className="flex h-14 flex-row items-center border-b-2 border-b-[#b9c0f0]">
      <PlayerAvatar name={name} />
      <Text className="flex-1 text-wrap text-justify">{name}</Text>
      <View className="mr-3 h-full flex-col justify-center">
        <View className="flex-row justify-center gap-x-2">
          <View id="update-button">
            <TouchableOpacity
              onPress={handleUpdateModalOpen}
              className="h-6 w-6 items-center justify-center bg-gray-100">
              <EditIcon size={24} color="#0073e6" />
            </TouchableOpacity>
          </View>
          <View id="delete-button">
            <TouchableOpacity
              onPress={handleDeleteModalOpen}
              className="h-6 w-6 items-center justify-center bg-gray-100">
              <DeleteIcon color="#0073e6" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <InplaceModal visible={activeModal === 'update'}>
        <View className="mb-6">
          <Text className="text-lg">
            Updating <Text className="font-bold">{name}</Text>
          </Text>
        </View>
        <View>
          <Text className="mb-2 text-center">New Player Name</Text>
          <TextInput
            placeholder="Enter new Player name"
            value={newName}
            onChangeText={handleNewNameChange}
            maxLength={20}
            className="rounded border border-gray-300 p-2"
          />
          {nameExists && (
            <View>
              <Text className="text-center text-red-600">
                A player with this name already exists
              </Text>
            </View>
          )}
        </View>
        <View className="mt-2 w-full flex-row justify-evenly">
          <Button
            title="Update"
            onPress={handleUpdateModalClose}
            disabled={name === newName || nameExists}
          />
          <Button title="Cancel" onPress={handleUpdateModalReset} />
        </View>
      </InplaceModal>

      <InplaceModal visible={activeModal === 'delete'}>
        <Text className="text-center text-sm">
          {`Are you sure you want to delete the player '${name}' ?`}
        </Text>
        <Text className="mt-4 text-center text-sm font-bold">{`This action is irreversible.`}</Text>
        <View className="mt-2 w-full flex-row justify-evenly">
          <Button title="Delete" onPress={handleDeleteModalClose} />
          <Button title="Cancel" onPress={handleDeleteModalReset} />
        </View>
      </InplaceModal>
    </View>
  );
}
