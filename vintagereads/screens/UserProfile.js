import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, TextInput, TouchableOpacity, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome'; 

const colors = {
  light: {
    background: '#fdf3e1',
    text: '#4e3629',
    primary: '#8d5524',
    buttonBackground: '#8d5524', 
    buttonText: '#fff', 
    containerBackground: '#fff9f3', 
    border: '#64442c', 
  },
  dark: {
    background: '#2f1a11',
    text: '#f4e1d2',
    primary: '#8c6c4b',
    secondary: '#6b4f3b',
    buttonBackground: '#8c6c4b',
    buttonText: '#f4e1d2',
    containerBackground: '#3d2a1e',
    border: '#f1d26b',
  },
};

const UserProfile = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkTheme, setDarkTheme] = useState(true);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [accountName, setAccountName] = useState('');
  const themeColors = darkTheme ? colors.dark : colors.light;

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.get(`${BASE_URL}/api/user/profile`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log('User profile:', response.data);
          setUser(response.data);
          setUsername(response.data.username);
          setAccountName(response.data.accountName);
        } else {
          console.error('No token found');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error.response || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const toggleTheme = () => setDarkTheme(!darkTheme);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('email');
      navigation.navigate('SignIn');
      Alert.alert('Logged Out', 'You have been logged out successfully.');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Something went wrong while logging out.');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken'); // Retrieve token from AsyncStorage

      if (!token) {
        console.error('No token found');
        return;
      }

      const response = await axios.put(
        `${BASE_URL}/api/user/update`,
        { username, accountName }, // Pass the fields to update
        {
          headers: { Authorization: `Bearer ${token}` } // Send token in Authorization header
        }
      );

      Alert.alert('Success', 'Profile updated successfully!');
      setEditing(false);
      setUser(response.data); // Update user data locally
    } catch (error) {
      console.error('Error updating profile:', error.response || error.message);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: themeColors.background }]}>
        <ActivityIndicator size="large" color={themeColors.primary} />
        <Text style={[styles.loadingText, { color: themeColors.text }]}>Loading Profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.toggleContainer}>
        <Text style={[styles.toggleLabel, { color: themeColors.primary }]}>Dark Theme</Text>
        <Switch
          value={darkTheme}
          onValueChange={toggleTheme}
          thumbColor={darkTheme ? themeColors.primary : themeColors.secondary}
          trackColor={{ false: '#767577', true: themeColors.primary }}
        />
      </View>
      {user ? (
        <View style={[styles.profileContainer, { backgroundColor: themeColors.containerBackground, borderColor: themeColors.border }]}>
          <Text style={[styles.label, { color: themeColors.primary }]}>Username:</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
              value={username}
              onChangeText={setUsername}
            />
          ) : (
            <Text style={[styles.info, { color: themeColors.text }]}>{user.username}</Text>
          )}

          <Text style={[styles.label, { color: themeColors.primary }]}>Account Name:</Text>
          {editing ? (
            <TextInput
              style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
              value={accountName}
              onChangeText={setAccountName}
            />
          ) : (
            <Text style={[styles.info, { color: themeColors.text }]}>{user.accountName}</Text>
          )}

          <Text style={[styles.label, { color: themeColors.primary }]}>Email:</Text>
          <Text style={[styles.info, { color: themeColors.text }]}>{user.email}</Text>

          {editing ? (
            <TouchableOpacity style={[styles.saveButton, { backgroundColor: themeColors.primary }]} onPress={handleUpdateProfile}>
              <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>Save Changes</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.editButton, { backgroundColor: themeColors.primary }]} onPress={() => setEditing(true)}>
              <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>Edit Profile</Text>
            </TouchableOpacity>
          )}

          {/* Logout Button with Icon */}
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: themeColors.primary }]}
            onPress={handleLogout}
          >
            <Icon name="sign-out" size={20} color={themeColors.buttonText} style={styles.logoutIcon} />
            <Text style={[styles.buttonText, { color: themeColors.buttonText }]}>LogOut</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.noDataText, { color: themeColors.text }]}>No user data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 18 },
  toggleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 },
  toggleLabel: { fontSize: 16, marginRight: 10 },
  profileContainer: { borderRadius: 10, padding: 20, borderWidth: 1, marginBottom: 20 },
  label: { fontSize: 18, marginTop: 10 },
  info: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderRadius: 5, padding: 8, marginTop: 5, marginBottom: 15 },
  saveButton: { padding: 12, borderRadius: 5, marginTop: 15 },
  editButton: { padding: 12, borderRadius: 5, marginTop: 15 },
  logoutButton: { padding: 12, borderRadius: 5, marginTop: 15, flexDirection: 'row', alignItems: 'center' },
  buttonText: { textAlign: 'center', fontWeight: 'bold', fontSize: 16 },
  logoutIcon: { marginRight: 10 }, // Space between icon and text
  noDataText: { fontSize: 20, textAlign: 'center', marginTop: 20 },
});

export default UserProfile;
