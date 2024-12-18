//AUTHOR  (MUZNAH SAQIB UET 2022-CD-CE-1)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './screens/Welcome';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn'; 
import Library from './screens/Library'; 
import BookDetail from './screens/BookDetail';
import BookReader from './screens/BookReader';
import MainTabs from './screens/MainTabs';
import UserProfile from './screens/UserProfile'; 
import Wishlist from './screens/WishlistScreen';
// import userLibrary  from './UserLibrary';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Welcome">
    <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }}/>
    <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
    <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }}/>
    <Stack.Screen name="userProfile" component={UserProfile} options={{ headerShown: false }}/>
    <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
    <Stack.Screen name="Library" component={Library} options={{ headerShown: false }} />
    <Stack.Screen name="BookDetail" component={BookDetail} options={{ headerShown: false }} />
    <Stack.Screen name="wishlist" component={Wishlist} options={{ headerShown: false }} />
    <Stack.Screen name="BookReader" component={BookReader} options={{ headerShown: false }} />
</Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;
