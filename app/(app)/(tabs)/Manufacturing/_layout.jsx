// app/(tabs)/randomPage/_layout.jsx
import { Stack } from 'expo-router';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function ManufacturingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,    // show header for this stack
      }}
    >
      {/* these will match your file names: */}
      <Stack.Screen name="index"/>

      {/* <Stack.Screen name="ManuList" options={{ title: 'Quản Lý Đơn' }} />
      <Stack.Screen name="ManuDetail" options={{ title: 'Chi Tiết Sản Xuất' }} /> */}
    </Stack>
  );
}
