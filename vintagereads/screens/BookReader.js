import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '@env';

const BookReader = ({ route }) => {
  const { title, pdfLink, image } = route.params;
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [currentPageState, setCurrentPageState] = useState(0);

  const wordsPerPage = 200;
  const storageKey = `readingProgress_${encodeURIComponent(title)}`;

  useEffect(() => {
    const initializeReader = async () => {
      setLoading(true);
      setPages([]);
      try {
        // Retrieve saved progress
        const savedProgress = await AsyncStorage.getItem(storageKey);
        console.log('Saved progress:', savedProgress); 
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          setCurrentPageState(parsedProgress.currentPage || 0); // Set the last saved page
        }

        // Simulate splitting content into pages (assuming pdfLink contains plain text)
        if (pdfLink) {
          const contentPages = pdfLink
            .split(' ')
            .reduce((acc, word, index) => {
              const pageIndex = Math.floor(index / wordsPerPage);
              if (!acc[pageIndex]) acc[pageIndex] = [];
              acc[pageIndex].push(word);
              return acc;
            }, [])
            .map((page) => page.join(' '));

          setPages(contentPages);
        }
      } catch (error) {
        console.error('Error initializing reader:', error);
        Alert.alert('Error', 'Failed to load book content.');
      } finally {
        setLoading(false);
      }
    };

    initializeReader();
  }, [pdfLink]);

  const saveProgress = async (page) => {
    const email = await getUserEmail();
    if (!email) {
      console.error('User email not found');
      return;
    }

    const percentageRead = Math.round(((page + 1) / pages.length) * 100);

    try {
      await axios.post(`${BASE_URL}/api/progress`, {
        email,
        title,
        image,
        currentPage: page,
        percentageRead,
      });
      console.log('Progress saved:', { title, page, percentageRead });
      // Save progress locally
      await AsyncStorage.setItem(storageKey, JSON.stringify({ currentPage: page }));
    } catch (error) {
      console.error('Error saving progress:', error.response ? error.response.data : error.message);
    }
  };

  const getUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      return email;
    } catch (error) {
      console.error('Error fetching email:', error);
      return null;
    }
  };

  const handleNextPage = () => {
    if (currentPageState < pages.length - 1) {
      const nextPage = currentPageState + 1;
      setCurrentPageState(nextPage);
      saveProgress(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPageState > 0) {
      const previousPage = currentPageState - 1;
      setCurrentPageState(previousPage);
      saveProgress(previousPage);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bookTitle}>{title}</Text>
      {pages.length > 0 ? (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <Text style={styles.bookContent}>{pages[currentPageState]}</Text>
        </ScrollView>
      ) : (
        <Text>No content available</Text>
      )}

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPageState === 0 && styles.disabledButton]}
          onPress={handlePreviousPage}
          disabled={currentPageState === 0}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>
          Page {currentPageState + 1} of {pages.length}
        </Text>
        <TouchableOpacity
          style={[styles.paginationButton, currentPageState === pages.length - 1 && styles.disabledButton]}
          onPress={handleNextPage}
          disabled={currentPageState === pages.length - 1}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    flex: 1,
    padding: 20,
    backgroundColor: '#FAF3E3',
  },
  bookTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6b4f3d',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  bookContent: {
    fontSize: 22,
    lineHeight: 24,
    color: '#333',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  paginationButton: {
    backgroundColor: '#6b4f3d',
    padding: 10,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BookReader;
