import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, AsyncStorage} from 'react-native';

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state= {
            email: '',
            emailError: false,
            password: '',
            passwordError: false,
            loginError: false,
        }
    }

    async login() {

        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (this.state.email === '' || reg.test(this.state.email) === false) {
            this.setState({emailError: true});
        }

        if (this.state.password === '') {
            this.setState({passwordError: true});
        }

        await fetch('http://api.music-mix.live/users/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            })
        }).then((response) => {
                if (response.ok) {
                    response.json().then(async (json) => {
                        this.setState({loginError: false})
                        console.log(json);
                        await AsyncStorage.setItem('ID', json.id);
                        await AsyncStorage.setItem('Token', json.token);
                        await AsyncStorage.setItem('Username', json.username);
                        await AsyncStorage.setItem('Date', Date.now().toString());

                        this.props.navigation.replace('Home');
                    })
                } else {
                    this.setState({loginError: true})
                }
            })
            .catch((error) => console.log(error));
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>
                    
                    <View style={styles.loginHeader}>
                        <Image source={require('../assets/MusicMix_logo.png')}/>
                    </View>
        
                    
                    <View style={styles.loginFormContainer}>
                        <View style={{marginBottom: '10%'}}>
                            <Text style={styles.loginFormLabel}>Email</Text>
                            <TextInput
                                autoCompleteType={'email'}
                                autoCorrect={false}
                                style={styles.loginFormInput}
                                onChangeText={(text) => this.setState({email: text, emailError: false})}
                                value={this.state.email}
                            />
                            {this.state.emailError ? (
                                <Text style={styles.errorText}>Please provide an email</Text>
                            ) : (null)}
                        </View>
        
                        <View>
                            <Text  style={styles.loginFormLabel}>Password</Text>
                            <TextInput
                                autoCompleteType={'password'} 
                                secureTextEntry={true}
                                style={styles.loginFormInput}
                                onChangeText={(text) => this.setState({password: text, passwordError: false})}
                                value={this.state.password}
                            />
                            {this.state.passwordError ? (
                                <Text style={styles.errorText}>Please provide a password</Text>
                            ) : (null)}
                        </View>
                    </View>
                    
        
        
                    <View style={styles.loginNavigationContainer}>
        
                        <TouchableOpacity style={styles.loginButton} onPress={() => this.login()}>
                            <Text style={styles.loginButtonText}>Log in</Text>
                        </TouchableOpacity>
                        {this.state.loginError ? (
                            <Text style={styles.errorText}>Email or/and password is not correct</Text>
                        ): (null)}
        
                        <TouchableOpacity 
                            style={{marginTop: '10%'}}
                            onPress={() => this.props.navigation.navigate('Register')}
                        >
                            <Text style={styles.navigatoBackToRegister}>Don´t have an account? Sign up now!</Text>
                        </TouchableOpacity>
        
                    </View>

                    
                </View>
            </TouchableWithoutFeedback>
        );
    }
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
        elevation: 3,
        marginBottom: '25%',
    },
    loginFormContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginFormLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
    loginFormInput: {
        width: 250,
        borderBottomWidth: 2,
        fontSize: 16,
        padding: 2,
        margin: 5,
    },
    errorText: {
        color: 'darkred',
        fontWeight: 'bold',
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
    },
    loginButton: {
        height: '20%',
        width: '20%',
        borderRadius: 20,
        backgroundColor: 'darkcyan',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '5%',
    },
    loginButtonText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
});