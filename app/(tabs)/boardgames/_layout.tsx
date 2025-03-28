import { Stack } from 'expo-router/stack';

export default function StackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[name]/index"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="[name]/[config]/index"
        options={{
          headerShown: true,
          headerTitleAlign: 'center',
        }}
      />
    </Stack>
  );
}
