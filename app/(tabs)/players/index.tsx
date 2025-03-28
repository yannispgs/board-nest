import { useConvex, useMutation } from 'convex/react';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import InplaceModal from '~/components/InplaceModal';
import PlayerCardList from '~/components/PlayerCardList';
import { api } from '~/convex/_generated/api';

const playerNameMaxLength = 20;

export default function Tab() {
  const createPlayer = useMutation(api.player.create);
  const convex = useConvex();

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [validationMessage, setValidationMessage] = useState('');
  const [isPlayerNameValid, setIsPlayerNameValid] = useState(false);

  useEffect(() => {
    const validatePlayerName = async () => {
      let msg = '';
      if (newPlayerName.length < 3) {
        msg = 'Player name must be at least 3 characters long';
      } else if (!newPlayerName.match(/^[a-zA-ZéèÉÈ0-9- ]+$/)) {
        msg =
          'Player name must contain only letters, numbers, spaces, or hyphens';
      } else {
        try {
          if (await convex.query(api.player.get, { name: newPlayerName })) {
            msg = 'A player with this name already exists';
          }
        } catch (error) {
          console.error('Error checking player name', error);
          Alert.alert(
            'An error has occurred. Check the console logs to have more details.'
          );
        }
      }

      if (msg) {
        setValidationMessage(msg);
        setIsPlayerNameValid(false);
      } else {
        setValidationMessage('');
        setIsPlayerNameValid(true);
      }
    };

    validatePlayerName();
  }, [convex, newPlayerName]);

  const resetPlayerCreationModal = () => {
    setNewPlayerName('');
    setIsCreateModalVisible(false);
  };

  const handlePlayerCreation = () => {
    if (isPlayerNameValid) {
      try {
        createPlayer({ name: newPlayerName });

        setNewPlayerName('');
        setIsCreateModalVisible(false);
      } catch (error) {
        console.error('Error creating player', error);
        Alert.alert(
          'An error has occurred. Check the console logs to have more details.'
        );
      }
    }
  };
  return (
    <View className="flex h-full flex-col">
      <View className="mx-2 mt-2 h-5/6">
        <PlayerCardList />
      </View>

      <View className="h-1/6 items-center justify-center">
        <TouchableOpacity
          onPress={() => {
            setIsCreateModalVisible(true);
          }}
          className="rounded-full bg-[#0023f4] px-2">
          <Text className="px-2 py-1 text-lg text-white">Create Player</Text>
        </TouchableOpacity>
      </View>

      <InplaceModal visible={isCreateModalVisible}>
        <TextInput
          placeholder="Enter new Player name"
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          maxLength={playerNameMaxLength}
        />
        {!isPlayerNameValid && (
          <View>
            <Text className="text-center text-red-600">
              {validationMessage}
            </Text>
          </View>
        )}
        <View className="mt-2 w-full flex-row justify-evenly">
          <Button title="Close" onPress={resetPlayerCreationModal} />
          <Button
            title="Create"
            onPress={handlePlayerCreation}
            disabled={!isPlayerNameValid}
          />
        </View>
      </InplaceModal>
    </View>
  );
}
