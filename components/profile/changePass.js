import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';


export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            newPassword: '',
            confPassword: '',
            PasswordError: '',
            successMsg: '',
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

    _onFocus = () => {
        
    }

    //Method fired up when users tabs away
    _onBlur = () => {
        this.setState({
            newPassword: '',
            confPassword: '',
            PasswordError: '',
            successMsg: '',
        })
    }

    //Method used to validate user input
    validate() {  
        
        //If new password doesnt match this regex string
        if (!this.state.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            //set this error msg to state and return false
            this.setState({PasswordError: 'Password must be at least 8 characters and contain at least 1 number, 1 uppercase and 1 lowercase character'})
            return false;
        }

        //If confirmation password doesnt match new password
        if (!this.state.confPassword.match(this.state.newPassword)) {
            //set this error msg to state and return false
            this.setState({PasswordError: 'Passwords does not match'})
            return false;
        }
            
        //else return true
        return true;
    }

    async changePassword() {
       const isValid = this.validate();

        if (isValid) {

            //Variable that holds JWT token found in storage
            var token = await AsyncStorage.getItem('Token');
            //Variable that holds user id found in storage
            var userID = await AsyncStorage.getItem('ID');
            var url = "http://api.music-mix.live/users/pass/" + userID+""

            //Patch user data
            await axios
            .patch(url, 
                { password: this.state.newPassword },  
                { headers: { Authorization: 'Bearer '+token }, },)
            .then(response => {
                //If response ok then do following
                if (response.status === 200) {
                    //set successMsg to "...changed successfully"
                    this.setState({ successMsg: "Password changed successfully!", newPassword: '',
                    confPassword: '', });
                    //After 1 second set successMsg back to empty
                    setTimeout(() => {
                        this.setState({ successMsg: '' });
                    }, 2000)
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
                
                <View style={styles.profilePassContainer}>

                    <View style={styles.profilePassRow}>
                        <Text style={styles.profilePassLabel}>New password</Text>
                        <TextInput 
                            style={styles.profilePassInput}
                            autoCompleteType={'password'} 
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({newPassword: text, PasswordError: ''})}
                            value={this.state.newPassword} 
                        />
                    </View>

                    <View style={styles.profilePassRow}>
                        <Text style={styles.profilePassLabel}>Confirm new password</Text>
                        <TextInput 
                            style={styles.profilePassInput}
                            autoCompleteType={'password'} 
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({confPassword: text, PasswordError: ''})}
                            value={this.state.confPassword} 
                        />
                    </View>
                    {!this.state.PasswordError == '' ? (
                        <Text style={styles.ErrorText}>{this.state.PasswordError}</Text>
                    ) : (null)}

                </View>

                <TouchableOpacity style={styles.profilePassButton} onPress={() => this.changePassword()}>
                    <Text style={styles.profilePassButtonText}>Change password</Text>
                </TouchableOpacity>

                {this.state.successMsg !== '' ? (
                        <Text style={styles.successMsg}>{this.state.successMsg}</Text>
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
    profilePassContainer: {
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center',
        marginTop: '10%',
    },
    profilePassRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center',
        marginVertical: '10%',
    },
    profilePassLabel: {
        fontWeight: 'bold',
        fontSize: 16,
        width: '40%',
        alignSelf: 'center',
    },
    profilePassInput: {
        fontSize: 18,
        width: '60%',
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
    profilePassButton: {
        backgroundColor: 'darkcyan',
        alignItems: 'center',
        alignSelf: 'center',
        width: '55%',
        padding: '2%',
        borderRadius: 20,
        marginTop: '10%',
    },
    profilePassButtonText: {
        fontWeight: 'bold',
        fontSize: 16
    },
});