import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import OrderStatusTab from '../../../components/OrderStatusTab';

const HomePage = () => {
  return (
    <View style={styles.background}>
        {/* Dashboard Heading */}
        <View style={styles.headerWrapper}>
          <View style={styles.headingRow}>
            <Text style={styles.headingText}>Dashboard</Text>
            <Text style={styles.dateText}>22 JUL</Text>
          </View>

          <View style={{ marginTop: 30 }}>
            <Text style={styles.subHeadingText}>Tổng doanh thu</Text>
            <Text style={styles.headingText}>$123456789</Text>
          </View>

          {/* Fixed Tracking + Ngày Ship Row */}
          <View style={styles.infoRow}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Tracking mới nhất</Text>
              <Text style={styles.infoValue}>SKU001</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Ngày Ship gần nhất</Text>
              <Text style={styles.infoValue}>20 JUL 2025</Text>
            </View>
          </View>
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
    marginTop: 50,
  },

  headingText: {
    fontSize: 40,
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
