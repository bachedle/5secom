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
import AccessDenied from '../../../components/AccessDenied';
import OrderListItem from '../../../components/OrderListItem';
import ModalFilter from '../../../components/modalFilter';
import { AuthContext } from '../../../utils/authContext';
import { OrderContext } from '../../../utils/orderContext';

const ProductListPage = () => {
  const router = useRouter();

  const {logOut, user, token, fetchUser} = useContext(AuthContext);

  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const { 
    orders, 
    loading, 
    fetchOrders, 
    loadMoreOrders,
    loadingMore,
    hasMore,
  } = useContext(OrderContext);

  const handleStatusFilterChange = (status) => setSelectedStatus(status);
  const handleDateFilterChange = (date) => setSelectedDate(date);

  const isAdmin = () => {
    return user?.role?.name?.toLowerCase() === 'quản trị hệ thống'
  };

  // Handle pull-to-refresh
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

  const filteredOrders = orders.filter(order => {
    const isUnassigned = order.issuePlace === 'unassigned' || order.issuePlace === null ;
    const searchMatch =
      (order.name?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (order.skuOpt?.code?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (order.idNumber?.toLowerCase() || '').includes(searchText.toLowerCase()) ||
      (order.code?.toLowerCase() || '').includes(searchText.toLowerCase());
    const statusMatch = selectedStatus ? order.facilityType?.name === selectedStatus : true;
    const dateMatch = selectedDate ? order.createdDate?.split('T')[0] === selectedDate.toISOString().split('T')[0] : true;
    
    return searchMatch && statusMatch && dateMatch && isUnassigned;
  });

  const facilityTypes = Array.from(
    new Map(orders.map(o => [o.facilityType?.id, o.facilityType])).values()
  );

  const handleNavigateTo2ndPage = () => {
    router.navigate({
      pathname: 'AddStoreInfo',
    });
  };

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

  // 🔒 restrict page
  if (!isAdmin()) {
    return (
      <AccessDenied />
    );
  }

  return (
    <View style={styles.CONTAINER}>
      {/* Header */}
      <View style={styles.HEADER}>
        <Text style={styles.HEADER_TITLE}>Danh sách đơn</Text>

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
          <MaterialIcons name="tune" size={20} color="#1F509A" />
        </TouchableOpacity>
      </View>

      <ModalFilter
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedStatus={selectedStatus}
        selectedDate={selectedDate}
        onStatusFilterChange={handleStatusFilterChange}
        onDateFilterChange={handleDateFilterChange}
        facilityTypes={facilityTypes}
      />

      {/* Order List with Pull-to-Refresh and Infinite Scrolling */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => `${item.id || item.code}-${index}`}
        renderItem={({ item }) => <OrderListItem orderItem={item} modalType='edit'/>}
        
        // Pull-to-refresh
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#1F509A']}
            tintColor="#1F509A"
            title="Kéo để làm mới..."
            titleColor="#666"
          />
        }
        
        // Infinite scrolling
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        
        // Footer for loading more
        ListFooterComponent={renderFooter}
        
        // Styling
        contentContainerStyle={{ paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
        
        // Empty state
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#1F509A" />
                <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
              </>
            ) : (
              <Text style={styles.emptyText}>Không có đơn nào</Text>
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

export default ProductListPage;

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
    flex: 1,
    textAlign: 'center'
  },
  refreshButton: {
    padding: 4,
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
  
  // Loading states
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
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
  },
});