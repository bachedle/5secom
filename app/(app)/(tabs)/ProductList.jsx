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
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import OrderListItem from '../../../components/OrderListItem';
import AcceptedList from '../../../assets/data/acceptedList.json';
import ModalFilter from '../../../components/modalFilter';


const ProductListPage = () => {
  const { label } = useLocalSearchParams();
  const router = useRouter();

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

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

  const handleBack = () => {
    router.dismiss();
  };

  const handleNavigateTo2ndPage = () => {
    router.navigate({
      pathname: 'AddStoreInfo',
    });
  };


  // const filteredOrders = OrderItem.filter((order) => {
  //   const matchesLabel = order.label === label;
  //   const matchesSearch =
  //     searchText === '' ||
  //     order.name?.toLowerCase().includes(searchText.toLowerCase());

  //   const matchesDate =
  //     !deliveryDate ||
  //     new Date(order.deliveryDate).toDateString() ===
  //       new Date(deliveryDate).toDateString();

  //   return matchesLabel && matchesSearch && matchesDate;
  // });

  return (
    <View style={styles.CONTAINER}>
      {/* Header */}
      <View style={styles.HEADER}>
        {/* <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity> */}
        <Text style={styles.HEADER_TITLE}>Danh sách đơn</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Status Tabs */}
      <View style={styles.STATUS_TABS}>
        <TouchableOpacity
          style={styles.ACTIVE_TAB}
          onPress={handleNavigateTo2ndPage}
        >
          <Text style={styles.ACTIVE_TAB_TEXT}>Tạo đơn mới</Text>

        </TouchableOpacity>
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

      <ModalFilter
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedStatus={selectedStatus}
        selectedDate={selectedDate}
        onStatusFilterChange={handleStatusFilterChange}
        onDateFilterChange={handleDateFilterChange}
      />


      {/* Order List */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <OrderListItem orderItem={item} />}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.CARDS_WRAPPER}
      />
    </View>
  );
};

export default ProductListPage;


const styles = StyleSheet.create({
  CONTAINER: {
    flex: 1,
    backgroundColor: '#F7F6F6',
    paddingHorizontal: 12,
    paddingTop: 24,
  },
  HEADER: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 12,
  },
  HEADER_TITLE: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  STATUS_TABS: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ACTIVE_TAB: {
    backgroundColor: '#E8775D',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  ACTIVE_TAB_TEXT: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    marginRight: 8,
  },
  TAB_BADGE: {
    backgroundColor: 'white',
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  BADGE_TEXT: {
    color: '#A34025',
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
  CARDS_WRAPPER: {
    paddingBottom: 80,
  },
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
    marginTop: 20,
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
  resetButton: {
    backgroundColor: '#E0E0E0',
    marginTop: 8,
  },
  resetText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
  },
});
