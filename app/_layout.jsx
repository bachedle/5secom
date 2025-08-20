import { Stack } from 'expo-router';
import { AuthProvider } from '../utils/authContext';
import { OrderProvider } from '../utils/orderContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <OrderProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(app)" />
        </Stack>
      </OrderProvider>
    </AuthProvider>
  );
}
