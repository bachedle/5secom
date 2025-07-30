import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';

const cardData = [
  { label: 'Đơn Mới', count: 200, span: true },
  { label: 'Chưa Có Hình', count: 200 },
  { label: 'Vẽ 2D', count: 200 },
  { label: 'Thêu', count: 200 },
  { label: 'Cắt Laser', count: 200 },
  { label: 'Sản xuất', count: 200 },
  { label: 'Đóng gói', count: 200 },
];

const OrderStatusTab = ({ onCardPress = () => {} }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Đơn</Text>
      <View style={styles.grid}>
        {cardData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              item.span ? styles.spanCard : styles.halfCard,
            ]}
            onPress={() => onCardPress(item.label)}
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
    marginBottom: 10,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: '#E16A54',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginBottom: 12,
  },

  spanCard: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfCard: {
    width: '48%',
    alignItems: 'center',
  },

  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },

  count: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 8,
  },
});
