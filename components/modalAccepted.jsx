import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const ModalAccepted = ({ visible, onClose, orderItem }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalBox}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Trả đơn</Text>
            <Pressable onPress={onClose} hitSlop={8}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Product Name */}
          <Text style={styles.label}>
            Sản Phẩm: <Text style={styles.bold}>{orderItem.productName}</Text>
          </Text>

          {/* Image Placeholder */}
          <Text style={styles.label}>Hình Ảnh:</Text>
          <View style={styles.imagePlaceholder} />

          {/* File Link with Icon */}
          <View style={styles.linkRow}>
            <Text style={styles.linkText}>
              https://sdfdsf.fsfsd..ffs/sfsdfds
            </Text>
            <Feather name="download" size={16} color="black" />
          </View>

          {/* Text Input */}
          <Text style={styles.label}>Thông Tin Yêu Cầu:</Text>
          <TextInput
            style={styles.inputBox}
            placeholder="Nhập yêu cầu..."
            multiline
            textAlignVertical="top"
            returnKeyType="done"
          />

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.outlinedButton, styles.buttonSpacing]}
              onPress={onClose}
            >
              <Text style={styles.outlinedText}>Quay Lại</Text>
            </Pressable>
            <Pressable style={styles.filledButton}>
              <Text style={styles.filledText}>Nhận Đơn</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalAccepted;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 8,              // Android shadow
    shadowColor: '#000',       // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  imagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 13,
    color: '#333',
    flexShrink: 1,
    flexWrap: 'wrap',
    marginRight: 8,
  },
  inputBox: {
    borderWidth: 1.5,
    borderColor: '#f18060',
    borderRadius: 8,
    minHeight: 80,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonSpacing: {
    marginRight: 12,
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#f18060',
    paddingVertical: 10,
    borderRadius: 8,
  },
  outlinedText: {
    textAlign: 'center',
    color: '#f18060',
    fontWeight: '600',
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#f18060',
    paddingVertical: 10,
    borderRadius: 8,
  },
  filledText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
});