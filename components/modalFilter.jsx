import {
  Modal,
  StyleSheet,
  View,
  Text,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const ModalFilter = ({
  visible,
  onClose,
  selectedStatus,
  selectedDate,
  onStatusFilterChange,
  onDateFilterChange,
  facilityTypes = [],
}) => {
  const [selectedOrder, setSelectedOrder] = useState(selectedStatus || '');
  const [deliveryDate, setDeliveryDate] = useState(selectedDate || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    setSelectedOrder(selectedStatus || '');
    setDeliveryDate(selectedDate || null);
  }, [visible]);

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animate out - smoother close animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const confirmFilter = () => {
    onStatusFilterChange(selectedOrder);
    onDateFilterChange(deliveryDate);
    onClose();
  };

  const handleDateChange = (event, selected) => {
    setShowDatePicker(false);
    if (selected) setDeliveryDate(selected);
  };

  // Handle outside press to close modal
  const handleOverlayPress = () => {
    onClose();
  };

  // Prevent modal from closing when pressing inside the modal box
  const handleModalBoxPress = (event) => {
    event.stopPropagation();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Animated overlay that closes modal when pressed */}
        <Animated.View style={[styles.overlayPressable, { opacity: fadeAnim }]}>
          <Pressable style={styles.overlayPressableInner} onPress={handleOverlayPress}>
            {/* Animated modal content that doesn't close when pressed */}
            <Animated.View 
              style={[
                styles.modalBox, 
                { 
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <Pressable onPress={handleModalBoxPress}>
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Tìm kiếm nâng cao</Text>
                  <Pressable onPress={onClose} hitSlop={8}>
                    <Text style={styles.closeText}>✕</Text>
                  </Pressable>
                </View>

                {/* Status Picker */}
                <Text style={styles.label}>Trạng thái</Text>
                <Picker
                  style={{ backgroundColor: '#f0f0f0' }}
                  selectedValue={selectedOrder}
                  onValueChange={(itemValue) => setSelectedOrder(itemValue)}
                >
                  {/* Default option */}
                  <Picker.Item label="Tất cả" value="" />

                  {/* Null-safe sort and mapping */}
                  {[...facilityTypes]
                    .sort((a, b) => (a?.orderNo ?? Infinity) - (b?.orderNo ?? Infinity))
                    .map((ft, idx) => (
                      <Picker.Item
                        key={ft?.id ?? idx}             // fallback key if ft is null
                        label={ft?.name ?? '—'}         // fallback label
                        value={ft?.name ?? ''}          // fallback value
                      />
                    ))}
                </Picker>

                {/* Delivery Date Picker */}
                <Text style={styles.label}>Ngày giao</Text>
                <Pressable
                  style={styles.dateButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.dateText}>
                    {deliveryDate
                      ? deliveryDate.toLocaleDateString()
                      : 'Chọn ngày giao'}
                  </Text>
                </Pressable>
                {showDatePicker && (
                  <DateTimePicker
                    value={deliveryDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                  />
                )}

                {/* Confirm + Reset Buttons */}
                <View style={styles.buttonRow}>
                  
                  <Pressable
                  style={[ styles.resetButton]}
                  onPress={() => {
                    setSelectedOrder('');
                    setDeliveryDate(null);
                    onStatusFilterChange('');
                    onDateFilterChange(null);
                    onClose();
                  }}
                >
                  <Text style={styles.resetText}>Xóa Bộ Lọc</Text>
                </Pressable>
                <Pressable style={styles.filledButton} onPress={confirmFilter}>
                    <Text style={styles.filledText}>Xác Nhận</Text>
                  </Pressable>
                </View>
              </Pressable>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalFilter;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  overlayPressable: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  overlayPressableInner: {
    ...StyleSheet.absoluteFillObject,
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
    elevation: 8,
    shadowColor: '#000',
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
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  filledButton: {
    backgroundColor: '#1F509A',
    width: "48%",
    borderRadius: 8,
  },
  filledText: {
    textAlign: 'center',
    padding:10,
    color: 'white',
    fontWeight: 'bold',
  },
  resetButton: {
    backgroundColor: '#ffffff',
    borderColor: "#1F509A",
    borderWidth: 1.5,
    width: " 48%",
    borderRadius: 8,
  },
  resetText: {
    textAlign: 'center',
    padding:10,
    color: '#333',
    fontWeight: 'bold',
  },
});