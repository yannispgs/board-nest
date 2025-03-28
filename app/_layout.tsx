import { Stack } from 'expo-router/stack';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

import { CONVEX_URL } from '~/utils/env';
import '~/global.css';

const convex = new ConvexReactClient(CONVEX_URL);

export default function Layout() {
  return (
    <ConvexProvider client={convex}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ConvexProvider>
  );
}
