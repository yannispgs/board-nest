import { pick } from '@junipero/core';
import { useConvex, useQuery } from 'convex/react';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';

import Line from '~/components/Line';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import {
  type CatanConfigCustomProps,
  type ConfigCustomProps,
  type ScytheConfigCustomProps,
  catanConfigCustomProps,
  scytheConfigCustomProps,
} from '~/convex/models';
import { configPropsType } from '~/types';
import { checkType, convert } from '~/utils/configs';

export default function BoardgameConfig() {
  const { config: configName, name: boardgameName } = useLocalSearchParams<{
    config: string;
    name: string;
  }>();
  const convex = useConvex();
  const navigation = useNavigation();

  let configCustomProps;
  switch (boardgameName) {
    case 'Catan': {
      configCustomProps = catanConfigCustomProps;

      break;
    }
    // case 'Forêt Mixte': {
    //   return 'foretMixteConfigs';
    // }
    case 'Scythe': {
      configCustomProps = scytheConfigCustomProps;

      break;
    }
    // case 'Terraforming Mars': {
    //   return 'terraformingMarsConfigs';
    // }
    default: {
      throw new Error('Unknown boardgame: ' + boardgameName);
    }
  }

  const config = useQuery(
    boardgameName === 'Catan' ? api.config.catan.get : api.config.scythe.get,
    {
      name: configName,
    }
  )!;

  const [configProps, setConfigProps] = useState<Record<string, any>>({});

  useEffect(() => {
    setConfigProps(() =>
      pick(config, Object.keys(configCustomProps) as Array<keyof typeof config>)
    );
  }, [config, configCustomProps]);

  const [isAllConfigPropsValid, setIsAllConfigPropsValid] = useState(true);

  const checkConfigProps = (props: configPropsType) => {
    let isAllPropsValid = true;
    Object.entries(props).forEach(([key, value]) => {
      const isCurrentPropValid = checkType(
        value.toString(),
        configCustomProps[key as keyof ConfigCustomProps]
      );
      if (!isCurrentPropValid) {
        isAllPropsValid = false;
      }
    });
    setIsAllConfigPropsValid(isAllPropsValid);
  };

  useEffect(() => {
    checkConfigProps(configProps);
  });

  if (!config || !Object.keys(configProps).length) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="mt-2 flex-col gap-y-4">
      <Stack.Screen options={{ title: `${boardgameName} - ${configName}` }} />

      {Object.entries(configCustomProps).map(([key, keyType]) => {
        const isCurrentPropValid = checkType(
          configProps[key].toString(),
          keyType
        );

        return (
          <View key={key}>
            <View className="flex-row justify-between">
              <View className="pl-4">
                <Text className="text-base">{key}</Text>
              </View>
              <View id="field-value">
                <TextInput
                  className="text-base font-bold"
                  placeholder="value"
                  value={configProps[key].toString()}
                  autoCapitalize="none"
                  onChangeText={(value) => {
                    setConfigProps({ ...configProps, [key]: value });
                  }}
                />
              </View>
              <View id="field-type">
                <Text className="w-[70] text-base italic">({keyType})</Text>
              </View>
            </View>
            {!isCurrentPropValid && (
              <View>
                <Text className="text-center text-red-600">
                  {`'${key}' must be of type '${keyType}'`}
                </Text>
              </View>
            )}
            <View className="pt-6">
              <Line width="60%" color="gray" />
            </View>
          </View>
        );
      })}
      <View>
        <Button
          title="Save changes"
          disabled={!isAllConfigPropsValid}
          onPress={async () => {
            try {
              Object.entries(configProps).forEach(([key, value]) => {
                configProps[key] = convert(
                  value,
                  configCustomProps[key as keyof ConfigCustomProps]
                );
              });

              switch (boardgameName) {
                case 'Catan': {
                  await convex.mutation(api.config.catan.update, {
                    id: config._id as Id<'catanConfig'>,
                    propsUpdated: configProps as CatanConfigCustomProps,
                  });

                  break;
                }
                case 'Scythe': {
                  await convex.mutation(api.config.scythe.update, {
                    id: config._id as Id<'scytheConfig'>,
                    propsUpdated: configProps as ScytheConfigCustomProps,
                  });

                  break;
                }
              }

              Alert.alert('Success', 'Config updated successfully', [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.goBack();
                  },
                },
              ]);
            } catch (error) {
              console.error(error);

              Alert.alert(
                'Error',
                'An error occurred while updating the config. Check the console logs'
              );
            }
          }}
        />
      </View>
    </View>
  );
}
