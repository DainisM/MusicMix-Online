import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Welcome from './screens/Welcome';
import Register from './screens/Register';
import Login from './screens/Login';
import Home from './screens/Home';
import Profile from './screens/Profile';
import Playlist from './screens/Playlist';

export default function App() {

  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{headerShown: false}}>
        <Stack.Screen 
          name="Welcome"
          component={Welcome}
        />
        <Stack.Screen 
          name="Register"
          component={Register}
        />
        <Stack.Screen 
          name="Login"
          component={Login}
        />
        <Stack.Screen 
          name="Home"
          component={Home}
        />
        <Stack.Screen 
          name="Profile"
          component={Profile}
        />
        <Stack.Screen 
          name="Playlist"
          component={Playlist}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
