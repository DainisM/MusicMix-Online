import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

export default class SeeProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '', 
            username: '',
            birthday: '', 
            gender: ''
        }
    }

    //Method that fetches user data on render
    async componentDidMount() {
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');
        //Variable that holds user id found in storage
        var userID = await AsyncStorage.getItem('ID');
        //Variable  that holds fetch link appended with user id
        var url = "http://api.music-mix.live/users/" + userID+""
        
        //Fetching data
        axios
            .get(url, { headers: { Authorization: 'Bearer '+token } })
            .then(response => response.data)
            .then(data => {
                //If response ok then set data into state
                this.setState({
                    username: data.username,
                    email: data.email,
                    birthday: data.details.birthday,
                    gender: data.details.gender
                  });
            })
            //else log error
            .catch(error => {
                console.log("error " + error);
            });
    }

    render() {
        return (
            <View style={styles.container}>               

                <View style={styles.profileInfoContainer}>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Email</Text>
                        <Text style={styles.profileInfoText}>{this.state.email}</Text>
                    </View>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Username</Text>
                        <Text style={styles.profileInfoText}>{this.state.username}</Text>
                    </View>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Birthday</Text>
                        <Text style={styles.profileInfoText}>{this.state.birthday}</Text>
                    </View>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Gender</Text>
                        <Text 
                            style={{
                                textTransform: 'capitalize', 
                                fontSize: 18, width: '70%', 
                                marginLeft: 20,
                            }}
                        >{this.state.gender}</Text>
                    </View>

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
    profileInfoContainer: {
        backgroundColor: 'rgba(173, 216, 230, 0.5)',
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center',
        position: 'absolute',
        top: '20%',
    },
    profileInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        alignSelf: 'center',
        borderBottomWidth: 2,
        marginVertical: '5%',
    },
    profileInfoLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        width: '30%',
        alignSelf: 'center',
        
    },
    profileInfoText: {
        fontSize: 18,
        width: '70%',
        marginLeft: 20,
    },
});