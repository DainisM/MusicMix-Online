import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfileStack from '../components/routes/profileStack';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
        }
    }

    //Method used to set username in state from storage
    async componentDidMount() {
        this.setState({username: await AsyncStorage.getItem('Username')})
    }

    render() {
        return (
            <View style={styles.container}>
                
                <View style={styles.profileHeaderContainer}>
                    <Icon 
                        name='arrow-left'
                        size={30}
                        color={'darkcyan'}
                        style={{margin: '3%'}}
                        onPress={() => this.props.navigation.popToTop()}
                    />
                    <Text style={styles.profileHeaderText}>{this.state.username}</Text>
                </View>

                <ProfileStack />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
    profileHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    profileHeaderText: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        color: 'darkcyan',
        margin: '2%',
    },
});