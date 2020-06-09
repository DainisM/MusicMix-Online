import React from 'react';
import { createMaterialTopTabNavigator  } from '@react-navigation/material-top-tabs';
import SeeProfile from '../profile/seeProfile';
import EditProfile from '../profile/editProfile';
import ChangePassword from '../profile/changePass';

const Tab = createMaterialTopTabNavigator ();

export default function HomeStack() {
    return (
            <Tab.Navigator initialRouteName='SeeProfile' 
                tabBarOptions={{
                    activeTintColor: 'cyan',
                    inactiveTintColor: 'darkcyan',
                    style: {backgroundColor: '#002930'},
                    labelStyle: {fontWeight: 'bold', fontSize: 16,}
                }}
            >
                <Tab.Screen name="See profile" component={SeeProfile}/>
                <Tab.Screen name="Edit profile" component={EditProfile}/>
                <Tab.Screen name="Change password" component={ChangePassword}/>
            </Tab.Navigator>
    )
}