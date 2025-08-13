import { StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Modal() {
    const router = useRouter()
    const handleBack =() => {
        router.dismissTo('../')
    }
  return (
    <View style={styles.container}>
      <Text>Modal screen</Text>
      <TouchableOpacity onPress={handleBack} >
        <Text>
            Back
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    width: 100,
    backgroundColor: '#fff',

    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
