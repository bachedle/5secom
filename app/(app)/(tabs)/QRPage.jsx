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
import * as ImagePicker from 'expo-image-picker'

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

  // Scan handler
  const handleScan = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert('Đã quét mã QR', `${data}`);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  // Flip camera handler
  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
  };

  const pickImageAndScan = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled) {
      try {
        // Use Camera.scanFromURLAsync instead of BarCodeScanner
        const barcodes = await Camera.scanFromURLAsync(result.uri, [
          Camera.Constants.BarCodeType.qr,
        ]);

        if (barcodes.length > 0) {
          const { data } = barcodes[0];
          // handle found QR code…
        } else {
          Alert.alert('Không tìm thấy QR code trong hình ảnh này');
        }
      } catch (err) {
        Alert.alert('Không thể quét hình ảnh', err.message);
      }
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
        onBarcodeScanned={handleScan}
      >
        <View style={styles.overlay}>
          <View style={styles.scanArea} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.buttonText}>Đổi camera</Text>
          </TouchableOpacity>
        </View>
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
  },
  button: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3,
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
