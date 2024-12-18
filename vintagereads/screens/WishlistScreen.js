import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, SafeAreaView } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WishlistScreen = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const email = await AsyncStorage.getItem('email');
      if (!email) {
        console.error('User email not found');
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/wishlist/${email}`);
        console.log('Wishlist data:', response.data); 
        setWishlist(response.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error.response ? error.response.data : error.message);
      }
    };

    fetchWishlist();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${item.percentageRead}%` }, // Dynamic progress width
            ]}
          />
        </View>
        <Text style={styles.progressText}>{item.percentageRead}% Completed</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Wishlist (Incomplete Books)</Text>
        <FlatList
          data={wishlist}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop:50,
    flex: 1,
    backgroundColor: '#FAF3E3', // Matches the background color of the screen
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FAF3E3',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6b4f3d', // Vintage dark brown color
    textAlign: 'center',
  },
  bookItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9e5c7', // Light vintage cream background
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookImage: {
    width: 70,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b2a1f', // Deep vintage brown color
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#ddd', // Light gray background for the bar
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#8c6c4b', // Vintage brown for the progress
  },
  progressText: {
    fontSize: 14,
    color: '#6b4f3d', // Vintage text color
  },
});

export default WishlistScreen;
