import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="games"
        options={{
          title: 'List of Games',
          headerShown: false,
          tabBarLabel: 'Games',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="gamepad" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="players/index"
        options={{
          title: 'List of Players',
          headerShown: false,
          tabBarLabel: 'Players',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="users" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="boardgames"
        options={{
          title: 'Compatible Boardgames',
          headerShown: false,
          tabBarLabel: 'Boardgames',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => (
            <FontAwesome6 size={28} name="chess" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
