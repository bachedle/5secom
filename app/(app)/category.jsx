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
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

import OrderListItem from '../../components/OrderListItem';
import { useAuth } from "../../utils/authContext";
import { OrderContext } from '../../utils/orderContext';

const ManufacturingListPage = () => {
  const { label, facilityCode } = useLocalSearchParams();
  const router = useRouter();

  const { 
    orders, 
    loading, 
    fetchOrders, 
    allOrders,
    loadMoreOrders,
    loadingMore,
    hasMore,
  } = useContext(OrderContext);
  
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const { user } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleBack = () => {
    router.dismiss();
  };

  const handleNavigateTo2ndPage = () => {
    router.navigate({
      pathname: 'accepted',
      params: { label: label, facilityCode: facilityCode},
    });
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDeliveryDate(selectedDate);
  };

  const confirmFilter = () => {
    setModalVisible(false);
  };

  const clearFilter = () => {
    setDeliveryDate(null);
    setModalVisible(false);
  };

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

  // Handle end reached for infinite scrolling
  const handleEndReached = () => {
    if (hasMore && !loadingMore) {
      loadMoreOrders();
    }
  };

  const acceptedOrder = allOrders.filter((order) => {
    const isAssigned = order.issuePlace !== 'unassigned' && order.issuePlace !== null && order.issuePlace !== "";
    const isUserMatch = order.issuePlace === user.name || order.issuePlace === user.username ;
    const facilityMatch = order.facilityType?.code === facilityCode;
    return isAssigned && isUserMatch && facilityMatch;  
  });

  const filteredOrders = orders.filter(order => {
    const isUnassigned = order.issuePlace === 'unassigned' || order.issuePlace === null;
    const searchMatch =
      (order.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (order.skuOpt?.code?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (order.code?.toLowerCase() || '').includes(searchText.toLowerCase());
    const statusMatch = selectedStatus ? order.facilityType?.name === selectedStatus : true;
    const dateMatch = selectedDate ? order.createdDate?.split('T')[0] === selectedDate.toISOString().split('T')[0] : true;
    const facilityMatch = order.facilityType?.code === facilityCode;
    return searchMatch && statusMatch && dateMatch && isUnassigned && facilityMatch;
  });

  // Render footer for loading indicator
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#1F509A" />
        <Text style={styles.loadingText}>Đang tải thêm...</Text>
      </View>
    );
  };

  useEffect(() => {
  console.log("Order IDs:", orders.map(o => o.id));
}, [orders]);

  return (
    <View style={styles.CONTAINER}>
      {/* Header */}
      <View style={styles.HEADER}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.HEADER_TITLE}>{label}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Status Tabs */}
      <View style={styles.STATUS_TABS}>
        <TouchableOpacity
          style={styles.ACTIVE_TAB}
          onPress={handleNavigateTo2ndPage}
        >
          <Text style={styles.ACTIVE_TAB_TEXT}>Đã nhận</Text>
          <View style={styles.TAB_BADGE}>
            <Text style={styles.BADGE_TEXT}>{acceptedOrder.length}</Text>
          </View>
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
          <MaterialIcons name="tune" size={20} color="#1F509A" />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalBox}>
            <View style={styles.header}>
              <Text style={styles.title}>Tìm kiếm nâng cao</Text>
              <Pressable onPress={() => setModalVisible(false)} hitSlop={8}>
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

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

            <View style={styles.buttonRow}>
              <Pressable style={styles.filledButton} onPress={confirmFilter}>
                <Text style={styles.filledText}>Xác Nhận</Text>
              </Pressable>

              <Pressable
                style={[styles.filledButton, styles.resetButton]}
                onPress={clearFilter}
              >
                <Text style={styles.resetText}>Xóa Bộ Lọc</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Order List with Infinite Scrolling */}
      <FlatList
        data={filteredOrders}
        renderItem={({ item }) => <OrderListItem orderItem={item} />}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        
        // Pull to refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1F509A']}
            tintColor="#1F509A"
          />
        }
        
        // Infinite scrolling
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        
        // Footer for loading more
        ListFooterComponent={renderFooter}
        
        // Styling
        contentContainerStyle={styles.CARDS_WRAPPER}
        showsVerticalScrollIndicator={false}
        
        // Empty state
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
        
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={20}
        windowSize={10}
      />

      {/* Initial loading overlay */}
      {loading && orders.length === 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1F509A" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      )}
    </View>
  );
};

export default ManufacturingListPage;

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
    fontSize: 30,
    fontWeight: 'bold',
  },
  STATUS_TABS: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  ACTIVE_TAB: {
    backgroundColor: '#0A3981',
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
    color: '#0A3981',
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
    gap: 10,
    marginTop: 20,
  },
  filledButton: {
    flex: 1,
    backgroundColor: '#0A3981',
    paddingVertical: 10,
    borderRadius: 8,
  },
  filledText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: '#E0E0E0'
  },
  resetText: {
    textAlign: 'center',
    color: '#333',
    fontWeight: '600',
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
  loadingFooter: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
})