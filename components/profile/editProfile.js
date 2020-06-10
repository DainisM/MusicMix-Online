import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';

export default class EditProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '', 
            username: '',
            birthday: '',
            gender: '',
            emailError: '',
            usernameError: '',
        }
    }

    componentDidMount() {
        this.props.navigation.addListener('focus', this._onFocus);
        this.props.navigation.addListener('blur', this._onBlur);
    }
    
    componentWillUnmount() {
        this.props.navigation.removeListener('blur', this._onBlur);
        this.props.navigation.removeListener('focus', this._onFocus);
    }

    _onFocus = () => {
        this.setState({
            email: 'usermail12@mail.com', 
            username: 'username00',
            birthday: moment('Thu Nov 27 1997').format('YYYY-MM-DD'),
            gender: 'male',
        })
    }

    _onBlur = () => {
        this.setState({
            email: '', 
            username: '',
            birthday: '',
            gender: '',
            emailError: '',
            usernameError: '',
        })
    }

    validate = () => {
        let emailError = "";
        let usernameError = "";

        if (!this.state.email || !this.state.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            emailError = "Invalid email";
        }

        if (this.state.username.length > 10 || this.state.username.length < 3) {
            usernameError = "Username must be between 3 and 10 characters long";
        }

        if (
            emailError ||
            usernameError
            ) {
            this.setState({
                emailError,
                usernameError,
            });
            return false;
        }
          //Else return true
          return true;
    }

    async editProfile () {
        const isValid = this.validate();

        if (isValid) {
            console.log('Email: '+this.state.email);
            console.log('Username: '+this.state.username);
            console.log('Gender: '+this.state.gender);
            console.log('Birthday: '+this.state.birthday);
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>               
                    
                    <View style={styles.profileEditContainer}>

                        <View style={styles.profileEditRow}>
                            <Text style={styles.profileEditLabel}>Email</Text>
                            <TextInput 
                                style={styles.profileEditInput}
                                autoCompleteType={'email'}
                                autoCorrect={false} 
                                onChangeText={(text) => this.setState({email: text, emailError: ''})}
                                value={this.state.email}
                            />
                        </View>
                        {!this.state.emailError == '' ? (
                            <Text style={styles.ErrorText}>{this.state.emailError}</Text>
                        ) : (null)}

                        <View style={styles.profileEditRow}>
                            <Text style={styles.profileEditLabel}>Username</Text>
                            <TextInput 
                                style={styles.profileEditInput}
                                autoCompleteType={'username'}
                                autoCorrect={false}
                                onChangeText={(text) => this.setState({username: text, usernameError: ''})}
                                value={this.state.username} 
                            />
                        </View>
                        {!this.state.usernameError == '' ? (
                            <Text style={styles.ErrorText}>{this.state.usernameError}</Text>
                        ) : (null)}

                        <View style={styles.profileEditRow}>
                            <Text style={styles.profileEditLabel}>Gender</Text>
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

                        <View style={styles.profileEditRow}>
                            <Text style={styles.profileEditLabel}>Birthday</Text>
                            <DatePicker
                                style={{width: '40%'}}
                                date={this.state.birthday}
                                mode="date"
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
                                onDateChange={(date) => {this.setState({birthday: date})}}
                            />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.profileEditButton} onPress={() => this.editProfile()}>
                        <Text style={styles.profileEditButtonText}>Update profile information</Text>
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
    profileEditContainer: {
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '10%',
    },
    profileEditRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center',
        marginVertical: '5%',
    },
    profileEditLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        width: '30%',
        alignSelf: 'center',
    },
    profileEditInput: {
        fontSize: 18,
        width: '70%',
        marginLeft: 20,
        borderBottomWidth: 1,
        padding: 2,
    },
    ErrorText: {
        alignSelf: 'center',
        color: 'darkred',
    },
    profileEditButton: {
        backgroundColor: 'darkcyan',
        alignItems: 'center',
        alignSelf: 'center',
        width: '55%',
        padding: '2%',
        borderRadius: 20,
        marginTop: '10%',
    },
    profileEditButtonText: {
        fontWeight: 'bold',
        fontSize: 16
    },
});