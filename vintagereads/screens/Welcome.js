import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

const Welcome = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'OldNewspaperTypes': require('../assets/fonts/OldNewspaperTypes.ttf'),
  });

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [userName, setUserName] = useState('Reader'); 

  useEffect(() => {
    const getUserName = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) {
        setUserName(storedName); 
      }
    };
    getUserName();
  }, []);

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  const themeStyles = isDarkMode ? darkTheme : lightTheme;

  return (
    <SafeAreaView style={[styles.overlay, { backgroundColor: themeStyles.background }]}>
      {/* Theme Toggle Button */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setIsDarkMode(!isDarkMode)}
      >
        <Ionicons
          name={isDarkMode ? 'moon' : 'sunny'}
          size={30}
          color={themeStyles.toggleIconColor}
        />
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title, { color: themeStyles.titleColor }]}>VintageReads</Text>

      {/* Catchy Tagline */}
      <Text style={[styles.subtitle, { color: themeStyles.subtitleColor }]}>
        Dive into timeless classics and explore the world of vintage literature.
      </Text>

      {/* Buttons placed at the bottom */}
      <View style={styles.buttonsContainer}>
        {/* Sign In Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeStyles.buttonBackground }]}
          onPress={() => navigation.navigate('SignIn')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: themeStyles.buttonBackground }]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Continue without Sign In Button */}
        <TouchableOpacity
          style={[styles.continueButton, { borderColor: themeStyles.buttonBackground }]}
          onPress={async () => {
            AsyncStorage.clear();
            await AsyncStorage.setItem('userName', 'Reader');
            navigation.navigate('Library'); 
          }}
        >
          <Text
            style={[styles.continueButtonText, { color: themeStyles.buttonBackground }]}
          >
            Continue without Signing In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const lightTheme = {
  background: '#f4e1d2',
  titleColor: '#8A4E28',
  subtitleColor: '#3b2a1f',
  buttonBackground: '#D27D46',
  toggleIconColor: '#5F3B2B',
};

const darkTheme = {
  background: '#2f1a11',
  titleColor: '#E3D8B8',
  subtitleColor: '#E3D8B8',
  buttonBackground: '#A15C3D',
  toggleIconColor: '#E3D8B8',
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    padding: 20,
  },
  title: {
    fontSize: 60,
    fontWeight: '700',
    marginBottom: 10,
    fontFamily: 'OldNewspaperTypes',
    textAlign: 'center',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.6)', // Dark shadow for text
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 40,
    fontFamily: 'OldNewspaperTypes',
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  button: {
    width: Platform.OS === 'web' || Platform.OS === 'windows' ? '30%' : '70%', 
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueButton: {
    width: Platform.OS === 'web' || Platform.OS === 'windows' ? '30%' : '70%', 
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'OldNewspaperTypes',
    textTransform: 'uppercase',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'OldNewspaperTypes',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  toggleButton: {
    position: 'absolute',
    top: 50, // Adjusted to be within safe area
    right: 30,
  },
});

export default Welcome;
