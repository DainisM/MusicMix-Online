import React, {Component} from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ShowPlaylist extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
            style={styles.playlistModal}
            animationType='slide'
            visible={this.props.playlistVisible}
            >
                <View style={styles.container}>

                    <TouchableOpacity style={styles.backButton} onPress={() => this.props.closePlaylist()}>
                        <Icon 
                            name='reply'
                            size={34}
                            color={'darkcyan'}
                        />
                    </TouchableOpacity>

                    <Text>User playlist</Text>

                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
    backButton: {
        margin: '2%',
    },
  });