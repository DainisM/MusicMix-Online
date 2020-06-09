import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import HomeStack from '../components/routes/homeStack';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                
                <HomeStack />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
});