import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
  Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BASE_URL } from '@env';

const { width, height } = Dimensions.get('window');
const colors = {
  light: {
    background: '#f4e1d2', 
    text: '#3b2a1f',
    primary: '#8c6c4b',
    secondary: '#6b4f3b', 
    buttonBackground: '#8c6c4b',
    buttonText: '#f4e1d2',
    containerBackground: '#f9e5c7',
    border: '#f1d26b', 
    highlight: '#6b9f4d', 
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
    highlight: '#6b9f4d', // Greenish accent for dark mode
  },
};

const Library = ({ navigation }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedAlphabet, setSelectedAlphabet] = useState('');
  const [accountName, setAccountName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

  const theme = isDarkMode ? colors.dark : colors.light;

  const fetchAccountName = async () => {
    try {
      const storedAccountName = await AsyncStorage.getItem('accountName');
      if (storedAccountName) {
        setAccountName(storedAccountName);
      } else {
        const defaultName = 'Reader!';
        setAccountName(defaultName);
        await AsyncStorage.setItem('accountName', defaultName);
      }
    } catch (error) {
      console.error('Error fetching account name:', error);
    }
  };

  const groupBooksByAuthor = (books) => {
    const authorBooksMap = {};
    books.forEach((book) => {
      if (book.author in authorBooksMap) {
        authorBooksMap[book.author].push(book);
      } else {
        authorBooksMap[book.author] = [book];
      }
    });
    return authorBooksMap;
  };

  const filterAuthorsByAlphabet = (alphabet) => {
    if (alphabet) {
      const filtered = authors.filter((author) => author.startsWith(alphabet));
      setFilteredAuthors(filtered);
    } else {
      setFilteredAuthors(authors);
    }
  };

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    fetchAccountName();

    fetch(`${BASE_URL}/books`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data); 
        const authorBooksMap = groupBooksByAuthor(data);
        setBooks(data);
        setAuthors(Object.keys(authorBooksMap));
        setFilteredAuthors(Object.keys(authorBooksMap));
      })
      .catch((error) => console.error('Error fetching books:', error));
  }, [navigation]);

  useEffect(() => {
    filterAuthorsByAlphabet(selectedAlphabet);
  }, [selectedAlphabet, authors]);

  const handleTabPress = (author) => {
    Animated.spring(scaleValue, {
      toValue: 1.2,
      friction: 3,
      useNativeDriver: true,
    }).start();

    setSelectedAuthor(author === selectedAuthor ? '' : author);
  };

  const renderBookItem = ({ item }) => {
    const imageUrl = `${BASE_URL}${item.image}`;
    const bookId = item._id ? item._id.toString() : `${item.title}-${item.author}`;

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('BookDetail', {
            _id: item._id,
            title: item.title,
            author: item.author,
            image: imageUrl,
            pdfLink: `${BASE_URL}${item.pdfLink}`,
            description: item.description,
            summary: item.summary,
            pages: item.pages,
            rating: item.rating,
            released: item.released,
            genre: item.genre,
            contentFile: `${BASE_URL}${item.contentFile}`,
          });
        }}
        style={[styles.bookItem, { backgroundColor: theme.containerBackground, borderColor: theme.border }]}
        key={bookId}
      >
        <Image source={{ uri: imageUrl }} style={styles.bookImage} resizeMode="cover" />
        <Text style={[styles.bookTitle, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: theme.secondary }]}>{item.author}</Text>
      </TouchableOpacity>
    );
  };

  const renderAuthorTabs = () => {
    return filteredAuthors.map((author) => (
      <TouchableOpacity
        key={author}
        style={[
          styles.authorTab,
          {
            backgroundColor: author === selectedAuthor ? theme.highlight : '#8c6c4b',
            borderColor: author === selectedAuthor ? '#006f61' : theme.border,
            width: 'auto', 
          },
        ]}
        onPress={() => handleTabPress(author)}
      >
        <Text style={[styles.authorName, { color: theme.text }]}>{author}</Text>
      </TouchableOpacity>
    ));
  };

  const renderAlphabetFilter = () => {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    return alphabets.map((alphabet) => (
      <TouchableOpacity
        key={alphabet}
        style={[styles.alphabetFilter, { backgroundColor: alphabet === selectedAlphabet ? theme.highlight : '#d8b77d' }]}
        onPress={() => setSelectedAlphabet(alphabet === selectedAlphabet ? '' : alphabet)}
      >
        <Text style={[styles.alphabetText, { color: theme.text }]}>{alphabet}</Text>
      </TouchableOpacity>
    ));
  };

  const renderBooksByAuthor = () => {
    const filteredBooks = selectedAuthor ? books.filter((book) => book.author === selectedAuthor) : books;

    return (
      <FlatList
        data={filteredBooks}
        renderItem={renderBookItem}
        keyExtractor={(item) => (item._id ? item._id.toString() : `${item.title}-${item.author}`)}
        numColumns={3}
        contentContainerStyle={styles.listContainer}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View  style={[styles.topSection, { height: Platform.OS === 'web' ? height * 0.5 : height * 0.27 }]}>
          <Text style={[styles.greeting, { color: theme.text }]}>Hi, {accountName}!</Text>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} style={styles.iconContainer}>
            <Icon name={isDarkMode ? 'sun-o' : 'moon-o'} size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.text, {color:theme.text}]}>Filter Authors</Text>
          <ScrollView horizontal style={styles.alphabetContainer} showsHorizontalScrollIndicator={false}>
            {renderAlphabetFilter()}
          </ScrollView>
          <Text style={[styles.text, {color:theme.text}]}>Filter books by author names</Text>
          <ScrollView horizontal style={styles.tabsContainer} showsHorizontalScrollIndicator={false}>
            {renderAuthorTabs()}
          </ScrollView>
        </View>

        <View style={[styles.bottomSection, { height: Platform.OS === 'web' ? height * 0.5 : height * 0.73, backgroundColor: theme.containerBackground }]}>
          {renderBooksByAuthor()}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { flex: 0.27,
     paddingHorizontal: 16, 
     paddingTop: 50, 
     justifyContent: 'flex-start' },
  bottomSection: { flex: 0.73, paddingHorizontal: 16, paddingTop: 16 },
  greeting: { fontSize: 28, fontWeight: 'bold' },
  iconContainer: { alignSelf: 'flex-end' },
  listContainer: { paddingBottom: 20 },
  bookItem: { marginHorizontal: 8, marginVertical: 12, borderRadius: 8, padding: 10, width: width * 0.28, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5, borderWidth: 1 },
  bookImage: { width: '100%', height: 150, borderRadius: 8 },
  bookTitle: { fontSize: 14, fontWeight: 'bold', marginTop: 8, textAlign: 'center' },
  bookAuthor: { fontSize: 12, marginTop: 4, textAlign: 'center' },
  authorTab: { paddingVertical: 6, paddingHorizontal: 14, marginHorizontal: 8, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2 },
  authorName: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  tabsContainer: { flexDirection: 'row', marginBottom: 8, marginTop: 8 },
  alphabetContainer: { flexDirection: 'row', marginBottom: 8, marginTop: 8 },
  alphabetFilter: { padding: 8, marginHorizontal: 4, borderRadius: 30, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  alphabetText: { fontSize: 12, fontWeight: 'bold' },
  text:{fontSize:22,fontWeight:'bold',fontStyle:'italic'}
});

export default Library;
