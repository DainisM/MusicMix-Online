import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default class SeeProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            profileInfo: {
                email: 'usermail12@mail.com', username: 'username00',
                birthday: 'Thu Nov 27 1997', gender: 'male'
            },
        }
    }

    render() {
        return (
            <View style={styles.container}>               

                <View style={styles.profileInfoContainer}>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Email</Text>
                        <Text style={styles.profileInfoText}>{this.state.profileInfo.email}</Text>
                    </View>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Username</Text>
                        <Text style={styles.profileInfoText}>{this.state.profileInfo.username}</Text>
                    </View>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Birthday</Text>
                        <Text style={styles.profileInfoText}>{this.state.profileInfo.birthday}</Text>
                    </View>

                    <View style={styles.profileInfoRow}>
                        <Text style={styles.profileInfoLabel}>Gender</Text>
                        <Text 
                            style={{
                                textTransform: 'capitalize', 
                                fontSize: 18, width: '70%', 
                                marginLeft: 20,
                            }}
                        >{this.state.profileInfo.gender}</Text>
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