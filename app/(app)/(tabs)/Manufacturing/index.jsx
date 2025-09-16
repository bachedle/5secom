import { StyleSheet, Text, View, ScrollView } from 'react-native'
import OrderStatusTab from '../../../../components/OrderStatusTab'

const Manufacturing = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.contentWrapper}>
        <OrderStatusTab />
      </View>
    </ScrollView>
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
    minHeight: "100%", 
  },
  scrollContent: {
    flexGrow: 1, // ensures it stretches & scrolls naturally
  },
})
