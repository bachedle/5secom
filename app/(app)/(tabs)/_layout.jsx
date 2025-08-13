import { useEffect } from 'react';
import { Tabs } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import { StatusBar } from 'expo-status-bar';
import { AntDesign } from '@expo/vector-icons';

export default function TabLayout() {
  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#121212');   // dark background
    NavigationBar.setButtonStyleAsync('light');         // light icons
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarStyle: {
            height: 100,
            
            backgroundColor: '#7C444F',
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: '#F39E60',
          tabBarInactiveTintColor: '#FFFFFF80',
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            headerShown: false,
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="Manufacturing"
          options={{
            headerShown: true,
            title: 'Sản Xuất',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="dashboard" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="QRPage"
          options={{
            headerShown: true,
            title: 'Mã QR',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="qrcode" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="ProductList"
          options={{
            headerShown: true,
            title: 'Đơn Hàng',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="shoppingcart" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="UserPage"
          options={{
            headerShown: false,
            title: 'Cá Nhân',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="user" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
