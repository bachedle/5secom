import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';

const QRPage = () => {
  const [facing, setFacing] = useState('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // Permission check
  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Xin cấp quyền truy cập máy ảnh</Text>
        <Button title="Cấp quyền" onPress={requestPermission} />
      </View>
    );
  }

  // Navigate to result page
  const navigateToResult = (qrData) => {
    console.log('Attempting to navigate with data:', qrData);
    
    try {
      router.navigate({
        pathname: 'QRResultPage',
        params: { qrData }
      });
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to alert
      Alert.alert('Navigation Error', `Could not navigate. QR Data: ${qrData}`);
    }
  };

  // Scan handler
  const handleScan = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      navigateToResult(data);
      // Reset after delay
      setTimeout(() => setScanned(false), 2000);
    }
  };

  // Flip camera handler
  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const pickImageAndScan = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        try {
          // Try using CameraView.scanFromURLAsync
          const scanResult = await CameraView.scanFromURLAsync(imageUri, ['qr']);
          
          if (scanResult && scanResult.length > 0) {
            const qrData = scanResult[0].data;
            navigateToResult(qrData);
          } else {
            Alert.alert('Không tìm thấy QR code', 'Không tìm thấy QR code trong hình ảnh này.');
          }
        } catch (scanError) {
          console.error('Scan from URL error:', scanError);
          
          // Fallback: Show alert that feature is not available
          Alert.alert(
            'Tính năng chưa sẵn sàng', 
            'Quét QR code từ hình ảnh hiện tại chưa khả dụng. Vui lòng sử dụng camera để quét trực tiếp.',
            [
              {
                text: 'OK',
                onPress: () => console.log('Image scan not available')
              }
            ]
          );
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Lỗi', 'Không thể chọn hình ảnh: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleScan}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>
{/* 
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Đổi camera</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.imageButton]} onPress={pickImageAndScan}>
            <Text style={styles.buttonText}>Chọn từ thư viện</Text>
          </TouchableOpacity>
        </View> */}
      </CameraView>
    </View>
  );
};

export default QRPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  permissionText: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
});