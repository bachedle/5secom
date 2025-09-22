import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React , { useContext, useEffect, useState }from 'react';
import OrderStatusTab from '../../../components/OrderStatusTab';
import {OrderContext} from '../../../utils/orderContext';
import { formatNumber } from '../../../utils/numberFormat';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomePage = () => {
  const { totalOrders, allOrders, fetchAllOrders } = useContext(OrderContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, [])
  
  
  const formattedDate = selectedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  }).toUpperCase();

  function isSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  const ordersForDate = allOrders.filter(order => {
    if (!order.createdDate) return false;
    const orderDate = new Date(order.createdDate); 
    return isSameDay(orderDate, selectedDate);
  });

  return (
    <View style={styles.background}>
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowPicker(false);
            if (date) setSelectedDate(date);
          }}
        />
      )}

      {/* Wrap entire content in ScrollView */}
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Orange Header */}
        <View style={styles.headerWrapper}>
          <View style={styles.headingRow}>
            <Text style={styles.headingText}>Dashboard</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View>
              <Text style={styles.subHeadingText}>Tổng đơn</Text>
              <Text style={styles.headingText}>{formatNumber(totalOrders)}</Text>
            </View>

            <View>
              <Text style={styles.subHeadingText}>Tổng đơn theo ngày</Text>
              <Text style={styles.headingText}>{formatNumber(ordersForDate.length)}</Text>
            </View>
          </View>
        </View>

        {/* White content that overlaps orange */}
        <View style={styles.contentWrapper}>
          <OrderStatusTab />
          {/* 🔥 Add more scrollable stuff here later */}
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#0A3981',
  },

  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 40, // more bottom padding for overlap
  },

  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headingText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
  },

  dateText: {
    backgroundColor: '#D4EBF8',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    color: '#000',
  },

  subHeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 20,

    // 🔥 overlap effect
    marginTop: -30,  // pull up to overlap header
  },
});