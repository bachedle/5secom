import { StyleSheet, Text, View, Button } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

const Page3 = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here (e.g., clear async storage or auth state)
    
    // Navigate all the way back to outer index (login page)
    router.dismiss(); // Adjust the path as necessary
  };

  return (
    <View style={styles.container}>
      <Text>Page 3</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default Page3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
