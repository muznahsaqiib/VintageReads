import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Dimensions, ImageBackground,Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { BASE_URL } from '@env';

const colors = {
  light: {
    background: '#fdf3e1',
    text: '#4e3629',
    primary: '#8d5524',
    secondary: '#64442c',
    buttonBackground: '#8d5524',
    buttonText: '#fdf3e1',
    containerBackground: '#fff9f3',
    border: '#64442c',
  },
  dark: {
    background: '#2e2b22',
    text: '#dcd3c9',
    primary: '#ad6c40',
    secondary: '#8d5524',
    buttonBackground: '#ad6c40',
    buttonText: '#fdf3e1',
    containerBackground: '#3b3a30',
    border: '#ad6c40',
  },
};

const { width } = Dimensions.get('window');

const SignUp = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [accountName, setAccountName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  // State to manage theme
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const currentTheme = isDarkTheme ? colors.dark : colors.light;

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/signup`, {
        username,
        email,
        password,
        accountName,
      });

      if (response.data && response.data.token) {
        const { token, user } = response.data; 
        await AsyncStorage.setItem('userToken', token);

        if (user && user.accountName) {
          await AsyncStorage.setItem('accountName', user.accountName);
        } else {
          console.warn('No account name provided in response');
        }

        navigation.navigate('MainTabs');
      } else {
        setErrorMessage("Failed to retrieve token");
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Failed to sign up');
      } else {
        setErrorMessage('Could not connect to the server');
      }
    }
  };

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ImageBackground
      source={require('../assets/images/authors.png')}  // Replace with your actual image path
      style={[styles.container, { backgroundColor: currentTheme.background }]} 
      resizeMode="cover" 
    >
      <BlurView
        style={styles.blurView} 
        intensity={90}  // Adjust blur intensity
        tint={isDarkTheme ? 'dark' : 'light'}  // Adjust tint based on theme
      >
        <TouchableOpacity onPress={toggleTheme} style={[styles.toggleButton, { backgroundColor: currentTheme.buttonBackground }]}>
          <Ionicons
            name={isDarkTheme ? 'sunny' : 'moon'}
            size={30}
            color={currentTheme.buttonText}
          />
        </TouchableOpacity>

        <View style={[styles.formContainer, { backgroundColor: currentTheme.containerBackground }]}>
          <Text style={[styles.header, { color: currentTheme.text }]}>Sign Up</Text>

          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.containerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
            placeholder="Username"
            placeholderTextColor={currentTheme.text}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.containerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
            placeholder="Email"
            placeholderTextColor={currentTheme.text}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.containerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
            placeholder="Password"
            placeholderTextColor={currentTheme.text}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.containerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
            placeholder="Confirm Password"
            placeholderTextColor={currentTheme.text}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TextInput
            style={[styles.input, { backgroundColor: currentTheme.containerBackground, color: currentTheme.text, borderColor: currentTheme.border }]}
            placeholder="Account Name"
            placeholderTextColor={currentTheme.text}
            value={accountName}
            onChangeText={setAccountName}
          />

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.buttonBackground }]} onPress={handleSignUp}>
            <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={[styles.signUpLink, { color: currentTheme.primary }]}>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blurView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    padding: 20,
  },
  formContainer: {
    width: Platform.OS === 'web' ? width * 0.3 : width * 0.8, 
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'OldNewspaperTypes',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'OldNewspaperTypes',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'OldNewspaperTypes',
  },
  signUpLink: {
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    fontFamily: 'OldNewspaperTypes',
  },
  toggleButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 10,
    borderRadius: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 15,
    fontFamily: 'OldNewspaperTypes',
  },
});

export default SignUp;
