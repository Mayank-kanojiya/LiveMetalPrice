import { Stack } from 'expo-router';

import { TimerProvider } from '../contexts/TimerContext';
export default function RootLayout() {
  return (
    // Wrap the Stack with the TimerProvider
    <TimerProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#d22929ff',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="details" options={{ presentation: 'modal' }} />
      </Stack>
    </TimerProvider>
  );
}