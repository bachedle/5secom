import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import ModalTest from '../components/modalTest';
import ModalAccepted from '../components/modalAccepted'

const OrderListItem = ({ orderItem, modalType = 'receive' }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        {/* Card Header */}
        <View style={styles.header}>
          <Text style={styles.orderId}>{orderItem.orderId}</Text>
          <Text style={styles.favorite}>
            {orderItem.isFavorite ? '★' : ''}
          </Text>
        </View>

        {/* Date / Time */}
        <Text style={styles.dateTime}>{orderItem.dateTime}</Text>

        {/* Main Row */}
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.sku}>{orderItem.sku}</Text>
            <Text>
              Sản Phẩm: <Text style={styles.bold}>{orderItem.productName}</Text>
            </Text>
            <Text>Ngày Cập Nhật: {orderItem.updateDate}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.qty}>{orderItem.quantity}</Text>
          </View>
        </View>

        {/* Label Tag */}
        <View style={styles.labelTag}>
          <Text style={styles.labelText}>{orderItem.label}</Text>
        </View>
      </TouchableOpacity>

      {/* Render the correct modal based on modalType */}
      {modalType === 'receive' ? (
        <ModalTest
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          orderItem={orderItem}
        />
      ) : (
        <ModalAccepted
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          orderItem={orderItem}
        />
      )}
    </>
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
    marginHorizontal: 10,
    padding: 12,
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
  sku: {
    fontWeight: '600',
    marginBottom: 4,
  },
  bold: {
    fontWeight: 'bold',
  },
  right: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
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