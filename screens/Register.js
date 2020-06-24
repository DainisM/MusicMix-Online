import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, TouchableOpacity, Keyboard, Image, TextInput, ScrollView} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker'

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
            confPassword: '', 
            birthday: '',
            gender: 'male',
            emailError: "",
            usernameError: "",
            passwordError: "",
            confPasswordError: "",
            birthdayError: "",
            registerMessage: ""
        }
    }

    //Method to validate user inputs
    validate = () => {
        let emailError = "";
        let usernameError = "";
        let passwordError = "";
        let confPasswordError = "";
        let birthdayError = "";

        if (!this.state.email || !this.state.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            emailError = "Invalid email";
        }

        if (this.state.username.length > 10 || this.state.username.length < 3) {
            usernameError = "Username must be between 3 and 10 characters long";
        }

        if (!this.state.password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            passwordError = "Password must contain at least 8 characters and contain at least 1 number, 1 uppercase and 1 lowercase character";
        }

        if (!this.state.password.match(this.state.confPassword)) {
            confPasswordError = "Passwords does not match";
        }

        if (!this.state.birthday) {
            birthdayError = "Please choose your birthday";
        }

        //If there is some error then return false
        if (
            emailError ||
            usernameError ||
            passwordError ||
            confPasswordError ||
            birthdayError
            ) {
            this.setState({
                emailError,
                usernameError,
                passwordError,
                confPasswordError,
                birthdayError
            });
            return false;
        }
      
          //Else return true
          return true;
    }

    async signUp() {
        //Calling validation method
        const isValid = this.validate();

        //If isValid return true then post data to API
        if (isValid) {

            await fetch('http://api.music-mix.live/users/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: this.state.email,
                username: this.state.username,
                password: this.state.password,
                gender: this.state.gender,
                birthday: this.state.birthday
            })
            }).then((response) => {
                    if (response.ok) {
                        response.json().then(async (json) => {
                            this.setState({registerMessage: 'User created successfully!'})

                            setTimeout( () => {
                                this.props.navigation.replace('Login');
                            }, 2000) 
                            
                        })
                    } else {
                        this.setState({loginError: true})
                    }
                })
                .catch((error) => console.log(error));
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                
                <View style={styles.container}>
                <ScrollView>

                    <View style={styles.registerHeader}>
                        <Image source={require('../assets/MusicMix_logo.png')}/>
                    </View>

                    <View style={styles.registerForm}>

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Email</Text>
                            <TextInput 
                                style={styles.regsterFormInput}
                                autoCompleteType={'email'}
                                autoCorrect={false} 
                                onChangeText={(text) => this.setState({email: text, emailError: ''})}
                                value={this.state.email}
                            />
                        </View>
                        {!this.state.emailError == '' ? (
                            <Text style={styles.ErrorText}>{this.state.emailError}</Text>
                        ) : (null)}


                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Username</Text>
                            <TextInput 
                                style={styles.regsterFormInput}
                                autoCompleteType={'username'}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({username: text, usernameError: ''})}
                                value={this.state.username} 
                            />
                        </View>
                        {!this.state.usernameError == '' ? (
                            <Text style={styles.ErrorText}>{this.state.usernameError}</Text>
                        ) : (null)}

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Password</Text>
                            <TextInput 
                                style={styles.regsterFormInput}
                                autoCompleteType={'password'} 
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({password: text, passwordError: ''})}
                                value={this.state.password} 
                            />
                        </View>
                        {!this.state.passwordError == '' ? (
                            <Text style={styles.ErrorText}>{this.state.passwordError}</Text>
                        ) : (null)}

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Confirm Password</Text>
                            <TextInput 
                                style={styles.regsterFormInput}
                                autoCompleteType={'password'} 
                                secureTextEntry={true}
                                onChangeText={(text) => this.setState({confPassword: text, confPasswordError: ''})}
                                value={this.state.confPassword} 
                            />
                        </View>
                        {!this.state.confPasswordError == '' ? (
                            <Text style={styles.ErrorText}>{this.state.confPasswordError}</Text>
                        ) : (null)}

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Gender</Text>
                            <Picker 
                                prompt={'Choose your gender'}
                                style={{width: '40%'}}
                                selectedValue={this.state.gender}
                                onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}
                            >
                                <Picker.Item label='Male' value='male'/>
                                <Picker.Item label='Female' value='female'/>
                            </Picker>
                        </View>

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Birthday</Text>
                            <DatePicker
                                style={{width: '40%'}}
                                date={this.state.birthday}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
                                maxDate="2020-01-01"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                customStyles={{
                                dateIcon: {
                                    position: 'absolute',
                                    left: 0,
                                    top: 4,
                                    marginLeft: 0
                                },
                                dateInput: {
                                    marginLeft: 36
                                }
                                }}
                                onDateChange={(date) => {this.setState({birthday: date, birthdayError: ''})}}
                            />
                        </View>
                        {!this.state.birthdayError == '' ? (
                            <Text style={styles.ErrorText}>{this.state.birthdayError}</Text>
                        ) : (null)}
                        

                    </View>


                    <View style={styles.registerNavigationContainer}>
                        <TouchableOpacity style={styles.registerButton} onPress={() => this.signUp()}>
                            <Text style={styles.reigsterButtonText}>Sign up</Text>
                        </TouchableOpacity>
                        {!this.state.registerMessage == '' ? (
                            <Text style={styles.signupSuccess}>{this.state.registerMessage}</Text>
                        ) :(null)}
        
                        <TouchableOpacity
                            style={{marginTop: '3%'}} 
                            onPress={() => this.props.navigation.navigate('Login')}
                        >
                            <Text style={styles.navigatoBackToLogin}>Already have an account? Log in now!</Text>
                        </TouchableOpacity>
        
                    </View>
                    </ScrollView>
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
    registerHeader: {
        height: '10%',
        width: '100%',
        alignItems: 'center',
        elevation: 3,
        marginBottom: '3%',
    },
    registerForm: {
        flexDirection: 'column',
        flexWrap: 'wrap',
        marginHorizontal: '5%',
        marginVertical: '5%',
        width: '90%',
    },
    registerFormRow: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: '1%',
    },
    ErrorText: {
        alignSelf: 'center',
        color: 'darkred',
    },
    registerFormLabel: {
        width: '40%',
        alignSelf: 'flex-start',
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    regsterFormInput: {
        width: '60%',
        height: '80%',
        alignSelf: 'flex-end',
        backgroundColor: 'darkcyan',
        fontSize: 16,
        borderRadius: 10,
    },
    registerNavigationContainer: {
        alignItems: 'center',
        height: '10%',
        marginVertical: '3%',
    },
    navigatoBackToLogin: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#002930',
        textDecorationLine: 'underline'
    },
    registerButton: {
        height: '60%',
        width: '20%',
        borderRadius: 20,
        backgroundColor: 'darkcyan',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reigsterButtonText: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    signupSuccess: {
        marginTop: '2%',
        color: 'darkgreen',
        fontWeight: 'bold',
        fontSize: 16,

    }
});