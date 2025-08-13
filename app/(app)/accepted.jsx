import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AcceptedList from '../../assets/data/acceptedList.json';
import OrderListItem from '../../components/OrderListItem'; // ✅ Import the component, not JSON
import ModalFilter from '../../components/modalFilter';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const AcceptedOrderPage = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleBack = () => {
    router.dismiss();
  };

  const handleStatusFilterChange = (status) => setSelectedStatus(status);
  const handleDateFilterChange = (date) => setSelectedDate(date);

  const filteredOrders = AcceptedList.filter(order => {
    const searchMatch =
      (order.productName?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (order.sku?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (order.orderId?.toLowerCase() || '').includes(searchText.toLowerCase());

    const statusMatch = selectedStatus ? order.label === selectedStatus : true;
    const dateMatch = selectedDate ? order.updateDate === selectedDate.toISOString().split('T')[0] : true;

    return searchMatch && statusMatch && dateMatch;
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
          <MaterialIcons name="tune" size={20} color="#A34025" />
        </TouchableOpacity>
      </View>

      {/* FlatList Order Cards */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.orderId}
        renderItem={({ item }) => <OrderListItem orderItem={item} modalType="return" />}
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
    borderColor: '#ccc',
    borderWidth: 1,
  },
  FILTER_BUTTON: {
    marginLeft: 8,
    padding: 8,
    backgroundColor: '#FFECE8',
    borderRadius: 8,
  },
});
