import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Page1 = () => {
  const router = useRouter();
  const { name } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Name: {name}</Text>
      <Button title="Go Back" onPress={() => router.dismiss()} />
    </View>
  );
};

export default Page1;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
});
