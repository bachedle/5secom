import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useState, useEffect, useContext } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ModalFilter from '../../components/modalFilter';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import OrderListItem from '../../components/OrderListItem';
import { useAuth } from "../../utils/authContext";

import { OrderContext } from '../../utils/orderContext';

const AcceptedOrderPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const { user } = useAuth();

  const { label, facilityCode } = useLocalSearchParams();

  const { orders, loading } = useContext(OrderContext);
  

  const handleBack = () => {
    router.dismiss();
  };

  const handleStatusFilterChange = (status) => setSelectedStatus(status);
  const handleDateFilterChange = (date) => setSelectedDate(date);

  const filteredOrders = orders.filter(order => {

    const isAssigned = order.issuePlace !== 'unassigned' && order.issuePlace !== null && order.issuePlace !== "";

    const isUserMatch = order.issuePlace === user.name;
    
    const facilityMatch = order.facilityType?.code === facilityCode;

    const searchMatch =
      searchText.trim() === '' ||
      (order.name?.toLowerCase() || '').includes(searchText.toLowerCase());

    const statusMatch = selectedStatus ? order.label === selectedStatus : true;
    const dateMatch = selectedDate ? order.updateDate === selectedDate.toISOString().split('T')[0] : true;

    return isAssigned && searchMatch && statusMatch && dateMatch && isUserMatch && facilityMatch;
  });

  return (
    <View style={styles.CONTAINER}>
      {/* Header */}
      <View style={styles.HEADER}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.HEADER_TITLE}>Đã Nhận</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search + Filter */}
      <View style={styles.SEARCH_CONTAINER}>
        <TextInput
          placeholder="Tìm kiếm"
          value={searchText}
          onChangeText={setSearchText}
          style={styles.SEARCH_INPUT}
        />
        <TouchableOpacity
          style={styles.FILTER_BUTTON}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="tune" size={20} color="#1F509A" />
        </TouchableOpacity>
      </View>

      {/* FlatList Order Cards */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <OrderListItem orderItem={item} modalType="accepted" />}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}

        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Không có đơn hàng</Text>
          </View>
        )}
      />


      <ModalFilter
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedStatus={selectedStatus}
        selectedDate={selectedDate}
        onStatusFilterChange={handleStatusFilterChange}
        onDateFilterChange={handleDateFilterChange}
      />
    </View>
  );
};

export default AcceptedOrderPage;

const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: '#F7F6F6',
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  HEADER: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  HEADER_TITLE: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  SEARCH_CONTAINER: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  SEARCH_INPUT: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    borderColor: '#0A3981',
    borderWidth: 1,
  },
  FILTER_BUTTON: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#D4EBF8',
    borderRadius: 8,
  },
    emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
    emptyText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "500",
  },

});
