import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AccessDenied = ({ message = "Bạn không có quyền truy cập vào trang này." }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="lock-closed" size={64} color="#E8775D" style={{ marginBottom: 16 }} />
      <Text style={styles.title}>Truy cập bị hạn chế</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

export default AccessDenied;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F6F6',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});
