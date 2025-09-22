import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

const QRResultPage = () => {
  const { qrData } = useLocalSearchParams();
  const qrDataString = qrData || 'No data';

  const handleBackToScanner = () => {
    router.back();
  };

  const handleOpenLink = () => {
    if (qrDataString && qrDataString.startsWith('http')) {
      Linking.openURL(qrDataString);
    } else {
      Alert.alert('Invalid URL', 'The QR code does not contain a valid URL');
    }
  };

  const copyToClipboard = () => {
    // Note: For full clipboard functionality, you'd need to install @react-native-clipboard/clipboard
    Alert.alert('Copied', 'URL copied to clipboard (functionality requires clipboard package)');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>QR Code Scanned</Text>
          <Text style={styles.subtitle}>Here's what we found:</Text>
        </View>
        
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Content:</Text>
          <View style={styles.dataBox}>
            <Text style={styles.dataText} selectable={true}>
              {qrDataString}
            </Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          {qrDataString.startsWith('http') && (
            <TouchableOpacity style={styles.button} onPress={handleOpenLink}>
              <Text style={styles.buttonText}>Mở liên kết</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity style={[styles.button, styles.copyButton]} onPress={copyToClipboard}>
            <Text style={styles.buttonText}>Sao chép</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, styles.backButton]} 
            onPress={handleBackToScanner}
          >
            <Text style={styles.buttonText}>Quay lại QR Scanner</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default QRResultPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  dataContainer: {
    marginBottom: 40,
  },
  dataLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  dataBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 15,
  },
  button: {
    backgroundColor: '#0A3981',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  copyButton: {
    backgroundColor: '#E38E49',
  },
  backButton: {
    backgroundColor: '#1F509A',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});