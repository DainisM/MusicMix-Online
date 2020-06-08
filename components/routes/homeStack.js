import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Browse from '../../screens/Browse';
import Search from '../../screens/Search';
import Library from '../../screens/Library';

const Stack = createStackNavigator();

export default function HomeStack() {
    return (
            <Stack.Navigator initialRouteName='Browse' screenOptions={{headerShown: false}}>
                <Stack.Screen name="Browse" component={Browse}/>
                <Stack.Screen name="Search" component={Search}/>
                <Stack.Screen name="Library" component={Library}/>
            </Stack.Navigator>
    )
}