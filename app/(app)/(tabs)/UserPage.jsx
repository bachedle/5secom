import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AuthContext } from '../../../utils/authContext';

const UserPage = () => {
  const router = useRouter();
  const { logOut, user, token, loading, fetchUser } = useContext(AuthContext);
  
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (user && token) {
        try {
          setProfileLoading(true);
          setError(null);
          await fetchUser();
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError(err.message || 'Failed to load user data');
        } finally {
          setProfileLoading(false);
        }
      }
    };

    loadUserData();
  }, []); // Empty dependency array - only run on mount

  const handleLogout = () => {
    logOut();
    router.replace('/SignIn');
  };

  const handleEdit = () => {
    router.navigate({
      pathname: 'UserEdit',
      params: {
        username: user?.username || '',
        image: user?.image || user?.avatar || '',
        credname: user?.name || user?.full_name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        birthdate: user?.dob || user?.birthdate || '',
        address: user?.address || '',
        idCardNumber: user?.idCardNumber || '',
      },
    });
  };

  // Show loading state
  if (loading || profileLoading) {
    return (
      <View style={[styles.background, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View style={[styles.background, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: 'white', fontSize: 16, marginBottom: 20, textAlign: 'center', paddingHorizontal: 20 }}>
          {error}
        </Text>
        <TouchableOpacity 
          onPress={() => {
            setError(null);
            if (user && token) {
              setProfileLoading(true);
              fetchUser().catch(console.error).finally(() => setProfileLoading(false));
            }
          }} 
          style={styles.signInButton}
        >
          <Text style={styles.signOutText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // If no user data, redirect to sign in
  if (!user) {
    router.replace('/SignIn');
    return null;
  }

  return (
    <View style={styles.background}>
      {/* Red Header */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerBackground}></View>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        {user.image || user.avatar ? (
          <Image 
            source={{ uri: user.image || user.avatar }} 
            style={styles.avatar} 
            onError={() => {
              console.log('Failed to load user image');
            }}
          />
        ) : (
          <View style={styles.avatar}>
            <MaterialCommunityIcons name="account" size={100} color="#ccc" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentWrapper}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.username}>
            {user.username || user.email || 'User'}
          </Text>
          <Text style={styles.role}>
            Role: {user.role.name || user.user_type || 'Member'}
          </Text>

          {/* Personal Info */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoTitle}>Thông tin người dùng</Text>
            <InfoRow 
              label="Họ và Tên" 
              value={user.name || user.full_name || user.credname} 
            />
            <InfoRow 
              label="Ngày Sinh" 
              value={user.dob || user.birthdate || user.birth_date} 
            />
            <InfoRow 
              label="Email" 
              value={user.email} 
            />
            <InfoRow 
              label="Số Điện Thoại" 
              value={user.phone || user.phone_number} 
            />
            <InfoRow 
              label="Địa Chỉ" 
              value={user.address} 
            />
            <InfoRow 
              label="CMND/CCCD" 
              value={user.idCardNumber} 
            />

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
    height: '25%',
    backgroundColor: '#E16A54',
  },
  headerBackground: {
    width: '100%',
    height: '100%',
  },
  avatarWrapper: {
    position: 'absolute',
    top: 90,
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
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingTop: 50,
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