import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View, Text, StyleSheet, Dimensions, ImageBackground ,Platform} from 'react-native';
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

const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const currentTheme = isDarkTheme ? colors.dark : colors.light;

  const handleSignIn = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/signin`, { email, password });
      
      if (response.data && response.data.token) {
        const { token, user } = response.data;
        await AsyncStorage.setItem('userToken', token);
        
        if (user && user.accountName) {
          await AsyncStorage.setItem('accountName', user.accountName);
          await AsyncStorage.setItem('email', user.email);
        } else {
          console.warn('No account name provided in response');
        }

        navigation.navigate('MainTabs');
      } else {
        setErrorMessage("Failed to retrieve token");
      }
    } catch (error) {
      console.error('Error during sign-in:', error);
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Invalid email or password');
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
      source={require('../assets/images/authors.png')}
      style={[styles.container, { backgroundColor: currentTheme.background }]} 
      resizeMode="cover" 
    >
      <BlurView
        style={styles.blurView} 
        intensity={80}
        tint={isDarkTheme ? 'dark' : 'light'} 
      >
        <TouchableOpacity onPress={toggleTheme} style={[styles.toggleButton, { backgroundColor: currentTheme.buttonBackground }]}>
          <Ionicons
            name={isDarkTheme ? 'sunny' : 'moon'}
            size={30}
            color={currentTheme.buttonText}
          />
        </TouchableOpacity>

        <Text style={[styles.header, { color: currentTheme.text }]}>Sign In</Text>

        <View style={styles.formContainer}>
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

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          <TouchableOpacity style={[styles.button, { backgroundColor: currentTheme.buttonBackground }]} onPress={handleSignIn}>
            <Text style={[styles.buttonText, { color: currentTheme.buttonText }]}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.signUpLink, { color: currentTheme.primary }]}>Don't have an account? Sign Up</Text>
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
    textAlign: 'center',
    fontFamily: 'OldNewspaperTypes',
  },
  input: {
    width: '100%',
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'OldNewspaperTypes',
  },
  button: {
    width: '100%',
    height: 45,
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

export default SignIn;
