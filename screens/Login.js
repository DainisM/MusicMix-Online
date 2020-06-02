import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity} from 'react-native';

export default function Login({navigation}) {
    return (
        <View style={styles.container}>
            <View style={styles.loginHeader}>
                <Image source={require('../assets/MusicMix_logo.png')}/>
            </View>

            <View>
                <View>
                    <Text>Email</Text>
                    <TextInput />
                </View>

                <View>
                    <Text>Password</Text>
                    <TextInput />
                </View>
            </View>


            <View style={styles.loginNavigationContainer}>

                <TouchableOpacity>
                    <Text>Log in</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.navigatoBackToRegister}>Doesn´t have an account? Sign up now!</Text>
                </TouchableOpacity>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#00758a',
    },
    loginHeader: {
        height: '10%',
        width: '100%',
        alignItems: 'center',
        marginBottom: '25%',
        elevation: 3,
    },
    loginNavigationContainer: {
        alignItems: 'center',
        marginVertical: '20%',
    },
    navigatoBackToRegister: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#002930',
        textDecorationLine: 'underline'
    }
});