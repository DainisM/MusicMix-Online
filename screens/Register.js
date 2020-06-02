import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default function Register() {
    return (
        <View style={styles.container}>
            <Text>Register screen</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});