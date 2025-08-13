import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { AuthContext } from '../../../utils/authContext'; // adjust path

const UserPage = () => {
  const router = useRouter();
  const { logOut } = useContext(AuthContext); // 🔹 get logOut from context

  const {
    username,
    image,
    credname,
    phone,
    email,
    birthdate,
    password,
  } = useLocalSearchParams();

  const [userImage, setUserImage] = useState(image || null);

  useEffect(() => {
    if (image) {
      setUserImage(image);
    }
  }, [image]);

  const handleLogout = () => {
    logOut(); // update auth state
    router.replace('/SignIn'); // go back to sign-in screen
  };

  const handleEdit = () => {
    router.navigate({
      pathname: 'UserEdit',
      params: {
        username,
        image,
        credname,
        phone,
        email,
        birthdate,
        password,
      },
    });
  };

  return (
    <View style={styles.background}>
      {/* Red Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerBackground}></View>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {userImage ? (
          <Image source={{ uri: userImage }} style={styles.avatar} />
        ) : (
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={100} color="#ccc" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.username}>{username || 'Username'}</Text>
          <Text style={styles.role}>Role: ABCXYZ</Text>

          {/* Personal Info */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Thông tin người dùng</Text>
            <InfoRow label="Họ và Tên" value={credname} />
            <InfoRow label="Ngày Sinh" value={birthdate} />
            <InfoRow label="Email" value={email} />
            <InfoRow label="Số Điện Thoại" value={phone} />
          </View>

          {/* Settings */}
          <TouchableOpacity style={styles.settingsRow} onPress={handleEdit}>
            <Text style={styles.settingsText}>Cài Đặt</Text>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity style={styles.signInButton} onPress={handleLogout}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || '-'}</Text>
  </View>
);

export default UserPage;



const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#E16A54',
  },
  headerWrapper: {
    width: '100%',
    height: 230,
    backgroundColor: '#E16A54',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
  },
  avatarWrapper: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 180,
    backgroundColor: '#ccc',
    borderWidth: 4,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 180,
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ddd',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 70,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  username: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  role: {
    textAlign: 'center',
    fontSize: 13,
    color: '#555',
    marginBottom: 20,
  },
  infoBlock: {
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#555',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#222',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 15,
    marginBottom: 30,
  },
  settingsText: {
    fontSize: 16,
    color: '#000',
  },
  arrow: {
    fontSize: 18,
    color: '#000',
  },
  signInButton: {
    backgroundColor: '#dd6b4d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
