import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import OrderListItem from '../../../../components/OrderListItem';
import OrderItem from '../../../../assets/data/orderList.json';
import axios from 'axios';
import AcceptedList from '../../../../assets/data/acceptedList.json';
import ModalFilter from '../../../../components/modalFilter'


const ManufacturingListPage = () => {
  const { label } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const filteredOrders = OrderItem.filter(order => order.label === label);

  const handleBack = () => {
    router.replace('(tabs)/Manufacturing')
  };

  const handleNavigateTo2ndPage = (label) => {
    router.push({
      pathname: '(tabs)/Manufacturing/[accepted].jsx',
      params: { label:label }})
  }

  return (
    <View style={styles.CONTAINER}>
      {/* Header */}
      <View style={styles.HEADER}>
        <TouchableOpacity onPress={ handleBack }>
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.HEADER_TITLE}>{label}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Status Tabs */}
      <View style={styles.STATUS_TABS}>
        <TouchableOpacity style={styles.ACTIVE_TAB} onPress={handleNavigateTo2ndPage}>
          <Text style={styles.ACTIVE_TAB_TEXT}>Đã nhận</Text>
          <View style={styles.TAB_BADGE}>
            <Text style={styles.BADGE_TEXT}>{AcceptedList.length}</Text>
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
          activeOpacity={0.8}>
          <MaterialIcons name="tune" size={20} color="#A34025" />
          <ModalFilter
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            orderItem={order}
          >

          </ModalFilter>
        </TouchableOpacity>
      </View>

      {/* FlatList Order Cards */}
      <FlatList
        
        data={filteredOrders}
        renderItem={({item})=> <OrderListItem orderItem={item} /> } 
      />
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
    fontSize: 20,
    fontWeight: 'bold',
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
});
