import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import React , { useContext, useState }from 'react';
import OrderStatusTab from '../../../components/OrderStatusTab';
import {OrderContext} from '../../../utils/orderContext';
import { formatNumber } from '../../../utils/numberFormat';
import DateTimePicker from '@react-native-community/datetimepicker';

const HomePage = () => {
  const { totalOrders } = useContext(OrderContext);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const formattedDate = selectedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  }).toUpperCase();

  const { orders } = useContext(OrderContext);
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

const ordersForDate = orders.filter(order => {
  if (!order.createdDate) return false;
  const orderDate = new Date(order.createdDate); // parse ISO from backend
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

        {/* Dashboard Heading */}
        <View style={styles.headerWrapper}>
          <View style={styles.headingRow}>
            <Text style={styles.headingText}>Dashboard</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={styles.dateText}>{formattedDate}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
            <View>
              <Text style={styles.subHeadingText}>Tổng đơn</Text>
              <Text style={styles.headingText}>{formatNumber(totalOrders)}</Text>
            </View>

            <View>
              <Text style={styles.subHeadingText}>Tổng đơn theo ngày</Text>
              <Text style={styles.headingText}>{formatNumber(ordersForDate.length)}</Text>
            </View>
          </View>

          

          {/* Fixed Tracking + Ngày Ship Row */}
          {/* <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Tracking mới nhất</Text>
              <Text style={styles.infoValue}>SKU001</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Ngày Ship gần nhất</Text>
              <Text style={styles.infoValue}>20 JUL 2025</Text>
            </View>
          </View> */}
        </View>

        {/* White Scrollable Section */}
        <View style={styles.contentWrapper}>
          <Text style={styles.placeholderText}>
            <OrderStatusTab></OrderStatusTab>
          </Text>
          {/* Add dynamic content below here */} 
        </View>
    </View>
  );
};
// coment

export default HomePage;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#E16A54',
  },

  headerWrapper: {
    paddingHorizontal: 20,
  },

  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 70,
  },

  headingText: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#fff',
  },

  dateText: {
    backgroundColor: '#F0B5AA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 40,
    fontWeight: 'bold',
    color: '#000',
  },

  subHeadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
  },

  infoBox: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },

  contentWrapper: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 20,
    paddingVertical: 20,
    paddingHorizontal: 20,
    minHeight: "100%", // Set a high value to simulate infinite scroll
  },

  placeholderText: {
    textAlign: 'center',
    color: '#000',
  },
});
