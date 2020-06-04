import React from 'react';
import { View, Text, StyleSheet, AsyncStorage, TouchableHighlight} from 'react-native';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            token: '',
            username: '',
            date: '',
        }
    }

    async componentDidMount() {
        this.setState({
            id: await AsyncStorage.getItem('ID'),
            token: await AsyncStorage.getItem('Token'),
            username: await AsyncStorage.getItem('Username'),
            date: await AsyncStorage.getItem('Date')
        })
    }
    
    async logout() {
        await AsyncStorage.clear();
        this.props.navigation.replace('Welcome');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Home screen</Text>
                
                <Text>ID - {this.state.id}</Text>
                <Text>Token - {this.state.token}</Text>
                <Text>Username - {this.state.username}</Text>
                <Text>Date - {this.state.date}</Text>


                <TouchableHighlight onPress={() => this.logout()}>
                    <Text>Logout</Text>
                </TouchableHighlight>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});