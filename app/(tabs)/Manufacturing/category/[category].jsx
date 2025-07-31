import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import OrderStatusTab from '../../../../components/OrderStatusTab';
import { useLocalSearchParams } from 'expo-router';
import { Button } from 'react-native';



const ManufacturingDetail = () => {

    const { label } = useLocalSearchParams();
    const router = useRouter();

  return (
    <View>
        <Text>ManufacturingDetail</Text>
        <Text>label: {label}</Text>
        <Button title="Go Back" onPress={() => router.back()} />
    </View>
  )
}

export default ManufacturingDetail

const styles = StyleSheet.create({})