import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DatePicker from 'react-native-datepicker';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import axios from 'axios';

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
            editMsg: '',
        }
    }

    //Method used to add 2 listeners when component mounts
    componentDidMount() {
        this.props.navigation.addListener('focus', this._onFocus);
        this.props.navigation.addListener('blur', this._onBlur);
    }
    
    //method used to remove listeners when component unmounts
    componentWillUnmount() {
        this.props.navigation.removeListener('blur', this._onBlur);
        this.props.navigation.removeListener('focus', this._onFocus);
    }

    //Listener method fired up when tab is focused
    _onFocus = async () => {

        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');
        //Variable that holds user id found in storage
        var userID = await AsyncStorage.getItem('ID');
        //Variable  that holds fetch link appended with user id
        var url = "http://api.music-mix.live/users/" + userID+""
        
        //Fetching data
        axios
            .get(url, { headers: { Authorization: 'Bearer '+token }, },)
            .then(response => response.data)
            .then(data => {
                //If response ok then set data into state
                this.setState({
                    username: data.username,
                    email: data.email,
                    gender: data.details.gender,
                    birthday: moment(data.details.birthday).format('YYYY-MM-DD')
                  });
            })
            //else log error
            .catch(error => {
                console.log("error " + error);
            });
    }

    //Method fired up when users tabs away
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

    //Method used to validate user input
    validate = () => {
        let emailError = "";
        let usernameError = "";

        //If user unput for email doesnt match regex string this error is set in variable
        if (!this.state.email || !this.state.email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
            emailError = "Invalid email";
        }

        //If user input for username is less than 3 or more than 10 length this error is set
        if (this.state.username.length > 10 || this.state.username.length < 3) {
            usernameError = "Username must be between 3 and 10 characters long";
        }

        //If there is some errors set them in state and retur false
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

    //Method used to edit profile data 
    async editProfile () {
        //Initializing validate method in this variable
        const isValid = this.validate();

        //Checking if it is valid (if true)
        if (isValid) {

            //Variable that holds JWT token found in storage
            var token = await AsyncStorage.getItem('Token');
            //Variable that holds user id found in storage
            var userID = await AsyncStorage.getItem('ID');
            var url = "http://api.music-mix.live/users/" + userID+""

            //Patch user data
            axios
            .patch(url, 
                {
                    email: this.state.email,
                    username: this.state.username,
                    gender: this.state.gender,
                    birthday: this.state.birthday
                },  { headers: { Authorization: 'Bearer '+token }, },)
            .then(async response => {
                //If response ok then do following
                if (response.status === 200) {
                    // update storage username
                    await AsyncStorage.setItem('Username', this.state.username)
                    //set editMsg to "...updated successfully"
                    this.setState({ editMsg: "Profile updated successfully!" });
                    //After 1 second redirect to home page
                    setTimeout(() => {
                        this.props.navigation.replace('Home');
                    }, 1000)
                }
            })
            //else log error
            .catch(error => {
                console.log("error " + error);
            });
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

                    {this.state.editMsg !== '' ? (
                        <Text style={styles.successMsg}>{this.state.editMsg}</Text>
                    ) : (null)}

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
    successMsg: {
        marginVertical: '5%',
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'center',
        color: 'green',
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