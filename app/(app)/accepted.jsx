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
  ActivityIndicator,
  RefreshControl,
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
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  const { label, facilityCode } = useLocalSearchParams();
  const { orders, loading, fetchOrders } = useContext(OrderContext);

  const handleBack = () => {
    router.dismiss();
  };

  const handleStatusFilterChange = (status) => setSelectedStatus(status);
  const handleDateFilterChange = (date) => setSelectedDate(date);

  // Pull to refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchOrders();
    } catch (error) {
      console.error('Error refreshing orders:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const isAssigned = order.issuePlace !== 'unassigned' && order.issuePlace !== null && order.issuePlace !== "";
    const isUserMatch = order.issuePlace === user.name || order.issuePlace === user.username
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1F509A']}
            tintColor="#1F509A"
          />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#1F509A" />
                <Text style={styles.loadingText}>Đang tải...</Text>
              </>
            ) : (
              <Text style={styles.emptyText}>Không có đơn hàng</Text>
            )}
          </View>
        )}
      />

      {/* Initial loading overlay */}
      {loading && orders.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1F509A" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      )}

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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(247, 246, 246, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});