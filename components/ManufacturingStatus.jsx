import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ManufacturingStatus = () => {
  return (
    <View>
        <View style={styles.contentWrapper}></View>
    </View>
  )
}

export default ManufacturingStatus

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