import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Stack } from 'expo-router/stack';

import '~/global.css';
import { CONVEX_URL } from '~/utils/env';

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
