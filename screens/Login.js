import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default function Login() {
    return (
        <View style={styles.container}>
            <Text>Login screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});