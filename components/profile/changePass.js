import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default class ChangePassword extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>               
                <Text>Change password</Text>
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