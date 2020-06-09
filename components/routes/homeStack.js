import React from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator  } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Browse from '../../screens/Browse';
import Search from '../../screens/Search';
import Library from '../../screens/Library';

const Tab = createBottomTabNavigator (); 

export default function HomeStack() {
    return (
            <Tab.Navigator initialRouteName='Browse'  
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                    if (route.name === 'Browse') {
                        return (
                        <Icon
                            name='home'
                            size={40}
                            color={focused ? 'cyan': 'darkcyan'}
                        />
                        );
                    } else if (route.name === 'Search') {
                        return (
                        <Icon
                            name='search'
                            size={30}
                            color={focused ? 'cyan': 'darkcyan'}
                        />
                        );
                    }
                    else if (route.name === 'Library') {
                        return (
                        <Icon
                            name='list'
                            size={30}
                            color={focused ? 'cyan': 'darkcyan'}
                        />
                        );
                    }
                    },
                })}
                tabBarOptions={{
                    activeTintColor: 'cyan',
                    inactiveTintColor: 'darkcyan',
                    style: {backgroundColor: '#002930'}
                }}
                >
                <Tab.Screen name="Browse" component={Browse}/>
                <Tab.Screen name="Search" component={Search}/>
                <Tab.Screen name="Library" component={Library}/>
            </Tab.Navigator>
    )
}

// screenOptions={{headerShown: false}}