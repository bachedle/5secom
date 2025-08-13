import { StyleSheet, Text, View } from 'react-native'
import OrderStatusTab from '../../../../components/OrderStatusTab'
const Manufacturing = () => {
  return (
    <View>
        <View style={styles.contentWrapper}>
            <OrderStatusTab></OrderStatusTab>
        </View>
    </View>
  )
}

export default Manufacturing

const styles = StyleSheet.create({
    contentWrapper: {
        backgroundColor: 'white',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        margin: 10,
        paddingVertical: 40,
        paddingHorizontal: 20,
        minHeight: "100%", // Set a high value to simulate infinite scroll
    },
})