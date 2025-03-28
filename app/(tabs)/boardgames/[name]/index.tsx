import { useConvex, useMutation, useQuery } from 'convex/react';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import InplaceModal from '~/components/InplaceModal';

import { api } from '~/convex/_generated/api';
import { configPropsType } from '~/types';
import { checkType, convert, getConfigAttributes } from '~/utils/configs';

export default function BoardgameDetails() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const convex = useConvex();
  const boardgame = useQuery(api.boardgame.get, {
    name,
  });

  const { configApiEndpoints, configCustomProps } = getConfigAttributes(name);
  const configs = useQuery(configApiEndpoints.list, {});

  const createConfig = useMutation(configApiEndpoints.create);

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');
  const [newConfigProps, setNewConfigProps] = useState<configPropsType>({});
  const [validationMessage, setValidationMessage] = useState('');
  const [isConfigNameValid, setIsConfigNameValid] = useState(false);
  const [isAllPropsValid, setIsAllPropsValid] = useState(false);

  const checkConfigName = async (configName: string) => {
    let msg = '';
    if (configName.length < 2) {
      msg = 'Config name must be at least 2 characters long';
    } else if (!configName.match(/^[a-zA-ZéèÉÈ0-9- ]+$/)) {
      msg =
        'Config name must contain only letters, numbers, spaces, or hyphens';
    } else if (
      await convex.query(configApiEndpoints.exists, { name: configName })
    ) {
      msg = 'A config with this name already exists';
    }

    if (msg) {
      setValidationMessage(msg);
      setIsConfigNameValid(false);
    } else {
      setValidationMessage('');
      setIsConfigNameValid(true);
    }
  };

  const checkConfigProps = (props: configPropsType) => {
    let res = Object.entries(props).length ? true : false;
    Object.keys(configCustomProps).forEach((prop) => {
      if (!props[prop]) {
        res = false;
      } else {
        const isCurrentPropValid = checkType(
          props[prop],
          configCustomProps[prop]
        );
        if (!isCurrentPropValid) {
          res = false;
        }
      }
    });
    setIsAllPropsValid(res);
  };

  useEffect(() => {
    checkConfigName(newConfigName);
    checkConfigProps(newConfigProps);
  });

  const handleConfigCreation = () => {
    let newProps: any = {};
    Object.entries(newConfigProps).forEach(([key, value]) => {
      newProps[key] = convert(value, configCustomProps[key]);
    });
    try {
      createConfig({
        boardgame: boardgame!._id,
        name: newConfigName,
        ...newProps,
      });

      setNewConfigName('');
      setNewConfigProps({});
      setIsCreateModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert(
        'An error has occurred. Check the console logs to ' +
          'have more details.'
      );
    }
  };

  const resetConfigCreationModal = () => {
    setNewConfigName('');
    setNewConfigProps({});
    setIsCreateModalVisible(false);
  };

  const renderProp = (key: string, value: any) => {
    switch (typeof value) {
      case 'string':
        return (
          <View key={key} className="flex-row justify-items-end">
            <Text className="w-1/2 text-sm">{key}</Text>
            <Text className="mr-6 text-sm">{'-->'}</Text>
            <Text className="w-2/5 text-sm">{value}</Text>
          </View>
        );
      case 'object':
        return (
          <View key={key} className="flex-col">
            <Text className="text-sm">{key} :</Text>
            <View className="mx-2 flex-col border-2 border-gray-200 px-2">
              {Object.entries(value).map(
                ([subKey, subValue]: [string, any]) => (
                  <View key={subKey} className="flex-row justify-items-end">
                    <Text className="w-1/2 text-sm">{subKey}</Text>
                    <Text className="mr-6 text-sm">{'-->'}</Text>
                    <Text className="w-2/5 text-sm">{subValue}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        );
    }
  };

  return (
    <View className="m-2 flex-col items-center">
      <Stack.Screen options={{ title: `Configuration - ${boardgame?.name}` }} />

      <Text className="text-lg font-bold">Type</Text>
      <View className="my-2 flex-col rounded-xl border-2 border-gray-300 p-2">
        {Object.entries(configCustomProps).map(([key, value]) =>
          renderProp(key, value)
        )}
      </View>
      <Text className="text-lg font-bold">Custom configs</Text>
      <View className="mt-2 w-full flex-col border-2 border-gray-300">
        {configs?.map((config: any) => (
          <Link
            key={config.name}
            href={`/boardgames/${boardgame!.name}/${config.name}`}>
            <View className="flex-row border-2 border-blue-300 pl-2">
              <Text className="w-full text-center text-base">
                {config.name}
              </Text>
            </View>
          </Link>
        ))}
      </View>
      <View className="h-1/6 items-center justify-center">
        <TouchableOpacity
          onPress={() => {
            setIsCreateModalVisible(true);
          }}
          className="rounded-full bg-gray-300 px-2">
          <Text className="px-2 text-lg">Add Config</Text>
        </TouchableOpacity>
      </View>

      <InplaceModal visible={isCreateModalVisible} id="create-config">
        <TextInput
          placeholder="Enter new Config name"
          value={newConfigName}
          onChangeText={setNewConfigName}
        />
        {!isConfigNameValid && (
          <View>
            <Text className="text-center text-red-600">
              {validationMessage}
            </Text>
          </View>
        )}

        <Text className="mb-2 mt-6 text-center text-lg">Configuration</Text>
        <ScrollView className="flex-col gap-y-1">
          {Object.entries(configCustomProps).map(([key, value]) => {
            const isCurrentPropValid = checkType(newConfigProps[key], value);

            return (
              <View key={key}>
                <View className="h-6 max-h-[200] flex-row items-center justify-between border-2 border-gray-300">
                  <View className="w-100% justify-center px-2">
                    <Text className="text-sm">{key}</Text>
                  </View>
                  <View>
                    <TextInput
                      className="h-[20] w-[80] bg-gray-300 pl-2"
                      placeholder="Value"
                      value={newConfigProps[key]}
                      autoCapitalize="none"
                      // eslint-disable-next-line react-native/no-inline-styles
                      style={{
                        textAlignVertical:
                          Platform.OS === 'android' ? 'center' : 'auto',
                        paddingVertical:
                          Platform.OS === 'android' ? 0 : undefined,
                        lineHeight: Platform.OS === 'android' ? 23 : undefined,
                      }}
                      onChangeText={(text) =>
                        setNewConfigProps({
                          ...newConfigProps,
                          [key]: text,
                        } as configPropsType)
                      }
                    />
                  </View>
                </View>
                {!isCurrentPropValid && (
                  <View>
                    <Text className="text-center text-red-600">
                      {`'${key}' must be of type '${value}'`}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>

        <View className="mt-4 w-full flex-row justify-evenly">
          <Button title="Close" onPress={resetConfigCreationModal} />
          <Button
            title="Create"
            onPress={handleConfigCreation}
            disabled={!isConfigNameValid || !isAllPropsValid}
          />
        </View>
      </InplaceModal>
    </View>
  );
}
