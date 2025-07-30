// app/(tabs)/randomPage/_layout.jsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RandomPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,    // show header for this stack
      }}
    >
      {/* these will match your file names: */}
      <Stack.Screen name="index" options={{ title: 'authen' }} />
      <Stack.Screen name="(tabs)"  options={{ title: 'home' }} />
    </Stack>
  );
}
