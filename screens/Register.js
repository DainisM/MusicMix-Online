import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Picker, TouchableOpacity, Keyboard, Image, TextInput, ScrollView} from 'react-native';
import DatePicker from 'react-native-datepicker'

export default class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            date: '',
            gender: 'Male'
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
                            />
                        </View>

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Username</Text>
                            <TextInput 
                                style={styles.regsterFormInput}
                                autoCompleteType={'username'}
                                autoCorrect={false} 
                            />
                        </View>

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Password</Text>
                            <TextInput 
                                style={styles.regsterFormInput}
                                autoCompleteType={'password'} 
                                secureTextEntry={true} 
                            />
                        </View>

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Confirm Password</Text>
                            <TextInput 
                                style={styles.regsterFormInput}
                                autoCompleteType={'password'} 
                                secureTextEntry={true} 
                            />
                        </View>

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Gender</Text>
                            <Picker 
                                prompt={'Choose your gender'}
                                style={{width: '40%'}}
                                selectedValue={this.state.gender}
                                onValueChange={(itemValue, itemIndex) => this.setState({gender: itemValue})}
                            >
                                <Picker.Item label='Male' vaue='male'/>
                                <Picker.Item label='Female' value='female'/>
                            </Picker>
                        </View>

                        <View style={styles.registerFormRow}>
                            <Text style={styles.registerFormLabel}>Birthday</Text>
                            <DatePicker
                                style={{width: '40%'}}
                                date={this.state.date}
                                mode="date"
                                placeholder="select date"
                                format="YYYY-MM-DD"
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
                                onDateChange={(date) => {this.setState({date: date})}}
                            />
                        </View>
                        

                    </View>


                    <View style={styles.registerNavigationContainer}>
                        <TouchableOpacity style={styles.registerButton} >
                            <Text style={styles.reigsterButtonText}>Sign up</Text>
                        </TouchableOpacity>
        
                        <TouchableOpacity
                            style={{marginTop: '5%'}} 
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
        marginBottom: '5%',
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
        marginVertical: '2%',
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
        marginVertical: '5%',
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
});