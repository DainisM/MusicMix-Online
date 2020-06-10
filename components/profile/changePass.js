import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard} from 'react-native';

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            password: '',
            currentPassword: '',
            newPassword: '',
            confPassword: '',
            PasswordError: '',
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
        this.setState({password: 'Passw0rd'});
    }

    _onBlur = () => {
        this.setState({
            password: '',
            currentPassword: '',
            newPassword: '',
            confPassword: '',
            PasswordError: '',
        })
    }

    validate = () => {
        if (!this.state.currentPassword.match(this.state.password)) {
            this.setState({PasswordError: 'Invalid current password'});
            return false;
        }

        if (!this.state.newPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)) {
            this.setState({PasswordError: 'Password must be at least 8 characters and contain at least 1 number, 1 uppercase and 1 lowercase character'})
            return false;
        }

        if (!this.state.confPassword.match(this.state.newPassword)) {
            this.setState({PasswordError: 'Passwords does not match'})
            return false;
        }
            
        return true;
        
    }

    async changePassword() {
        const isValid = this.validate();

        if (isValid) {
            console.log('Current password: '+this.state.currentPassword);
            console.log('New password: '+this.state.newPassword);
            console.log('Confirm new password: '+this.state.confPassword);
        }
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>               
                
                <View style={styles.profilePassContainer}>

                    <View style={styles.profilePassRow}>
                        <Text style={styles.profilePassLabel}>Current password</Text>
                        <TextInput 
                            style={styles.profilePassInput}
                            autoCompleteType={'password'} 
                            secureTextEntry={true}
                            onChangeText={(text) => this.setState({currentPassword: text, PasswordError: ''})}
                            value={this.state.currentPassword} 
                        />
                    </View>

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
        marginVertical: '5%',
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