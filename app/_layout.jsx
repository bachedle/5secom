import { Stack } from 'expo-router';
import { AuthProvider } from '../utils/authContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
            headerShown: false, // default: no headers
        }}
        >
            <Stack.Screen name="(app)" />
        </Stack>
    </AuthProvider>
    
  );
}
