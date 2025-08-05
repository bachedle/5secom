import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const OrderListItem = ({ orderItem }) => {
  const router = useRouter();

  const handleDetailPage = () => {
    router.push('modal'); // Navigate to the modal page
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleDetailPage}>
      <View style={styles.header}>
        <Text style={styles.orderId}>{orderItem.orderId}</Text>
        <Text style={styles.favorite}>{orderItem.isFavorite ? '★' : '☆'}</Text>
      </View>

      <Text style={styles.dateTime}>{orderItem.dateTime}</Text>

      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.sku}>{orderItem.sku}</Text>
          <Text>
            Sản Phẩm: <Text style={styles.bold}>{orderItem.productName}</Text>
          </Text>
          <Text>Ngày Cập Nhật: {orderItem.updateDate}</Text>
        </View>

        <View style={styles.right}>
          {/* <Image
            // If you have an image URL: source={{ uri: orderItem.imageUrl }}
            // Otherwise use a placeholder:
            source={require('../assets/placeholder.png')}
            style={styles.image}
            resizeMode="cover"
          /> */}
          <Text style={styles.qty}>{orderItem.quantity}</Text>
        </View>
      </View>

      <View style={styles.labelTag}>
        <Text style={styles.labelText}>{orderItem.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default OrderListItem;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff4e8',
    borderColor: '#f18060',
    borderWidth: 2,
    borderRadius: 12,
    marginVertical: 8,
    padding: 12,
    marginHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  favorite: {
    fontSize: 16,
  },
  dateTime: {
    color: '#444',
    marginBottom: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
  },
  bold: {
    fontWeight: 'bold',
  },
  sku: {
    fontWeight: '600',
    marginBottom: 4,
  },
  right: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  image: {
    width: 50,
    height: 50,
    backgroundColor: '#ccc',
    borderRadius: 4,
  },
  qty: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
  },
  labelTag: {
    backgroundColor: '#bfffff',
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 10,
  },
  labelText: {
    color: '#000',
    fontWeight: '600',
  },
});
