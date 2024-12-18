import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const BookDetail = ({ route, navigation }) => {
  const {
    title = 'Unknown Title',
    author = 'Unknown Author',
    image = null,
    description = 'No description available.',
    summary = 'No summary available.',
    pages = 'N/A',
    rating = 'N/A',
    released = 'N/A',
    genre = 'Unknown',
    pdfLink = '',
  } = route.params || {};

  const [scrollY] = useState(new Animated.Value(0)); 


  const handleStartReading = () => {
    
    console.log('Starting Reading!');
    navigation.navigate('BookReader', { title, pdfLink,image });
  };

  const imageHeight = scrollY.interpolate({
    inputRange: [0, 200], 
    outputRange: [300, 100],
    extrapolate: 'clamp',
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0], 
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Safe Area for Image to respect notch */}
        <Animated.View style={[styles.imageContainer, { opacity: imageOpacity }]}>
          {image && (
            <Animated.Image
              source={{ uri: image }}
              style={[styles.bookImage, { height: imageHeight }]}
              resizeMode="contain"
            />
          )}
        </Animated.View>

        {/* Book Details Section */}
        <View style={styles.detailsContainer}>
          <Text style={styles.bookTitle}>{title}</Text>
          <Text style={styles.bookAuthor}>by {author}</Text>
          <Text style={styles.bookGenre}>Genre: {genre}</Text>
          <Text style={styles.bookInfo}>Released: {released}</Text>
          <Text style={styles.bookInfo}>Pages: {pages}</Text>
          <Text style={styles.bookInfo}>Rating: {rating} / 5</Text>

          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.bookSummary}>{summary}</Text>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.bookDescription}>{description}</Text>

        
          {/* Start Reading Button */}
          <TouchableOpacity
            style={[styles.actionButton, styles.startReadingButton]}
            onPress={handleStartReading}
          >
            <Text style={styles.actionButtonText}>Start Reading Now</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop:50,
    flex: 1,
    backgroundColor: '#fdf3e1',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
    alignItems: 'center',
  },
  bookImage: {
    width: '100%',
  },
  detailsContainer: {
    backgroundColor: '#fff9f3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: -20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4e3629',
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 18,
    color: '#8d5524',
    marginBottom: 16,
  },
  bookGenre: {
    fontSize: 16,
    color: '#64442c',
    marginBottom: 8,
  },
  bookInfo: {
    fontSize: 16,
    color: '#64442c',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4e3629',
    marginTop: 20,
    marginBottom: 10,
  },
  bookSummary: {
    fontSize: 16,
    color: '#4e3629',
    lineHeight: 24,
    marginBottom: 16,
  },
  bookDescription: {
    fontSize: 16,
    color: '#4e3629',
    lineHeight: 24,
  },
  actionButton: {
    marginTop: 20,
    backgroundColor: '#8d5524',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  startReadingButton: {
    backgroundColor: '#4e3629', 
  },
  actionButtonText: {
    color: '#fdf3e1',
    fontSize: 16, 
    fontWeight: 'bold',
    textAlign: 'center',
    flexWrap: 'wrap', 
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 20,
    zIndex: 10,
  },
});

export default BookDetail;
