import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import ModalTest from '../components/modalTest';
import ModalAccepted from '../components/modalAccepted';

const OrderListItem = ({ orderItem, modalType = 'receive' }) => {
  const [modalVisible, setModalVisible] = useState(false);

  // 🔹 Normalize data in one place
  const orderCode = orderItem.code || orderItem.skuOpt?.code || orderItem.id || '---';

  const createdDate = orderItem.createdDate || '---';
  const updatedDate = orderItem.updatedDate || createdDate;
  const quantity = orderItem.area ?? 0;

  // Product info
  const sku = orderItem.skuOpt?.code || orderItem.product?.sku || 'N/A';
  const productName =
    orderItem.labelingStandard

  // Facility label
  const facilityName =
    orderItem.facilityType?.name || '---';

  return (
    <>
      <TouchableOpacity
        style={styles.card}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.orderId}>{orderCode}</Text>
          <Text style={styles.favorite}>
            {orderItem.isException ? '★' : ''}
          </Text>
        </View>

        {/* Date */}
        <Text style={styles.dateTime}>{createdDate}</Text>

        {/* Row with product info */}
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.sku}>SKU: {sku}</Text>
            <Text>
              Sản Phẩm: <Text style={styles.bold}>{productName}</Text>
            </Text>
            <Text>Ngày Cập Nhật: {updatedDate}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.qty}>{quantity}</Text>
          </View>
        </View>

        {/* Facility Label */}
        {facilityName && (
          <View style={styles.labelTag}>
            <Text style={styles.labelText}>{facilityName}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Correct modal */}
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
