import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export default class Welcome extends React.Component {
    constructor(props) {
        super(props)
    }

    async Login() {
        const date = await AsyncStorage.getItem('Date');
        const userDate = +new Date(parseInt(date));
        const now = +new Date();
    
        if (date !== null) {
    
          const dateAge = Math.round((now - userDate) / (1000 * 60));
          const tooOld = dateAge >= 480;
    
          if (tooOld) {
            await AsyncStorage.clear();
            this.props.navigation.navigate('Login');
          } else {
            this.props.navigation.navigate('Home');
          }
        } else {
            this.props.navigation.navigate('Login');
        }
    }


    render() {
        return (
            <View style={styles.container}>
    
                <Image style={styles.welcomeImage} source={require('../assets/MusicMix_logo.png')} />
    
                <View style={styles.catchPhraseContainer}>
                    <Text style={styles.catchPhraseText}>Music for everyone</Text>
                    <Text style={styles.catchPhraseText}>Tons of different music for every vibe</Text>
                </View>
    
                <View style={styles.navigationContainer}>
                    <TouchableOpacity style={styles.naviationToLogin} onPress={() => this.Login()}>
                        <Text style={styles.navigatonTextLogin}>Login</Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Register')}>
                        <Text style={styles.navigatonTextSignup}>Sign up</Text>
                    </TouchableOpacity>
    
                </View>
                
    
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
    welcomeImage: {
        height: '18%',
        width: '90%',
        alignSelf: 'center',
        marginTop: '10%',
    },
    catchPhraseContainer: {
        alignSelf: 'center',
        marginVertical: '20%',
    },
    catchPhraseText: {
        fontSize: 22,
        alignSelf: 'center',
        color: '#00758a',
        fontWeight: 'bold',
        textShadowColor: 'cyan',
        textShadowOffset: {width: 0.8, height: 0.8},
        textShadowRadius: 1,
    },
    navigationContainer: {
        marginTop: '20%',
        alignItems: 'center',
    },
    naviationToLogin: {
        height: '20%',
        width: '20%',
        borderRadius: 20,
        backgroundColor: '#00758a',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
    },
    navigatonTextLogin: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'cyan',
    },
    navigatonTextSignup: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'cyan',
        textDecorationLine: 'underline'
    },
});