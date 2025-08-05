import { StyleSheet, Text, View, Button, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';

const UserPage = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Add logout logic here
    router.dismiss(); // Or replace with actual logout navigation
  };

  const handleEdit = () => {
    router.push({
      pathname:'UserEdit',
      // params:
    });
  }
  return (
    <View style={styles.background}>
      {/* Red Header Section */}
      <View style={styles.headerWrapper}>
        <View style={styles.headerBackground}></View>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <View style={styles.avatar}></View>
      </View>

      {/* White Scrollable Section */}
      <View style={styles.contentWrapper}>
        {/* Username and role */}
        <Text style={styles.username}>Username</Text>
        <Text style={styles.role}>Role: ABCXYZ</Text>

        {/* Settings Row */}
        <View style={styles.settingsRow} >
          <Text style={styles.settingsText} onPress={handleEdit}>Cài Đặt</Text>
          <Text style={styles.arrow}>›</Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleLogout}>
          <Text style={{
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
          }}>Sign Out</Text>
        </TouchableOpacity>      
      </View>
    </View>
  );
};

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
    backgroundColor: '#ccc', // Placeholder gray circle
    borderWidth: 4,
    borderColor: '#fff',
  },

  contentWrapper: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 70, // Push content down due to avatar
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
    marginTop: 16,
  },
});
