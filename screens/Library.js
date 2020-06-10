import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CreatePlaylist from '../components/library/createPlaylist';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class Library extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            playlists: [
                {name: 'My playlist', image: require('../assets/Playlist.png')},
                {name: 'New music', image: require('../assets/Playlist.png')},
                {name: 'Good songs', image: require('../assets/Playlist.png')},
            ]
        }
    }

    closeModal = () => {
        this.setState({modalVisible: false});
    }

    openModal = () => {
        this.setState({modalVisible: true});
    }

    render() {
        return (
            <View style={styles.container}>
                
                <CreatePlaylist 
                    ModalVisible={this.state.modalVisible}
                    closeModal={this.closeModal}
                />


                <Text style={styles.playlistHeader}>Your playlists</Text>

                <TouchableOpacity style={styles.newPlaylistContainer} onPress={this.openModal}>
                    <Icon 
                        name='plus'
                        size={33}
                        color={'#00758a'}
                    />

                    <Text style={styles.newPlaylistText}>Create playlist</Text>
                </TouchableOpacity>

                <FlatList 
                    style={{marginTop: '5%'}} 
                    data={this.state.playlists}
                    keyExtractor={item => item.name}
                    renderItem={({item}) => 
                        <TouchableOpacity style={styles.userPlaylistContainer}>
                            <Image style={styles.userPlaylistImage} source={item.image}/>
                            <Text style={styles.userPlaylisName}>{item.name}</Text>
                        </TouchableOpacity>
                    } 
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
    playlistHeader: {
        fontWeight: 'bold',
        color: 'darkcyan',
        fontSize: 30,
        alignSelf: 'center',
        marginVertical: '3%',
    },
    newPlaylistContainer: {
        flexDirection: 'row',
        marginHorizontal: '5%',
        marginVertical: '3%',
    },
    newPlaylistText: {
        color: '#00758a',
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: '2%',
    },
    userPlaylistContainer: {
        alignItems: 'center',
        marginBottom: '10%',
    },
    userPlaylistImage: {
        height: deviceHeigh / 4,
        width: deviceWidth / 1.5,
    },
    userPlaylisName: {
        color: '#00758a',
        fontSize: 20,
    },
});