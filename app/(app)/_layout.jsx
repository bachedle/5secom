// app/(tabs)/randomPage/_layout.jsx
import { Redirect, Stack } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../utils/authContext'; 

export const unstable_settings = {
  initialRouteName: '(app)',
};

export default function AppLayout() {
  const authState = useContext(AuthContext);

  if (!authState.isLoggedIn) {
    return <Redirect href="/SignIn" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
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
      <Stack.Screen
        name="AddStoreInfo"
        options={{
          title: 'Tạo Đơn',
          headerShown: false,
          headerBackVisible: false,
          animation: "slide_from_right", // ✅ transition animation

        }}
      />
      <Stack.Screen
        name="AddGuestInfo"
        options={{
          title: 'Tạo Đơn',
          headerShown: false,
          headerBackVisible: false,
                    animation: "slide_from_right", // ✅ transition animation

        }}
      />
      <Stack.Screen
        name="AddOrderInfo"
        options={{
          title: 'Tạo Đơn',
          headerShown: false,
          headerBackVisible: false,
                    animation: "slide_from_right", // ✅ transition animation

        }}
      />
    </Stack>
  );
}
