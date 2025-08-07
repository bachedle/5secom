// app/(tabs)/randomPage/_layout.jsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RandomPageLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // default: no headers
      }}
    >
      <Stack.Screen name="index" options={{ title: 'authen' }} />
      <Stack.Screen name="(tabs)" options={{ title: 'home' }} />
      <Stack.Screen name="UserEdit" />
      <Stack.Screen
        name="category"
        options={{
          title: 'Sản Xuất',
          headerShown: true,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
