import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'; 
import { useOrder } from '../utils/orderContext';  // ✅ use facilities from context

const OrderStatusTab = () => {
  const router = useRouter();   
  const { facilities, loadingFacilities } = useOrder();

  const handleCardPress = (facility) => {
    router.navigate({
      pathname: 'category',
      params: { 
        facilityCode: facility.code,  // ✅ pass code (for filtering later)
        label: facility.name          // optional, if you still want to show name
      },
    });
  };

  if (loadingFacilities) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Quản lý Đơn</Text>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Đơn</Text>
      <View style={styles.grid}>
        {facilities.map((facility) => (
          <TouchableOpacity
            key={facility.id}
            style={styles.card}
            onPress={() => handleCardPress(facility)}
            activeOpacity={0.8}
          >
            <Text style={styles.label}>{facility.name}</Text>
            <Text style={styles.count}>{facility.quantity}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default OrderStatusTab;

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#E16A54',
    borderRadius: 16,
    width: '48%',        
    height: 120,         
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,         
    shadowColor: '#000',  
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  count: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
});
