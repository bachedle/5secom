import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router'; 

const cardData = [
  { id: 2, label: 'Chưa Có Hình', count: 200 },
  { id: 3, label: 'Vẽ 2D', count: 200 },
  { id: 4, label: 'Thêu', count: 200 },
  { id: 5, label: 'Cắt Laser', count: 200 },
  { id: 6, label: 'Sản xuất', count: 200 },
  { id: 7, label: 'Đóng gói', count: 200 },
];

const OrderStatusTab = () => {
  const router = useRouter();   

  const handleCardPress = (label) => {
    router.navigate({
      pathname: 'category',
      params: { label: label },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Đơn</Text>
      <View style={styles.grid}>
        {cardData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleCardPress(item.label)}
            activeOpacity={0.8}
          >
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.count}>{item.count}</Text>
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
    width: '48%',         // 2 per row
    height: 120,          // 🔥 fixed equal height
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,         // Android shadow
    shadowColor: '#000',  // iOS shadow
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
