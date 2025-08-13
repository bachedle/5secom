// app/(tabs)/randomPage/_layout.jsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

const isLoggedIn = false;

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // default: no headers
      }}
    >
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
        <Stack.Screen
          name="accepted"
          options={{
            title: 'Sản Xuất',
            headerShown: true,
            headerBackVisible: false,
          }}
        />
      
    </Stack>
  );
}
