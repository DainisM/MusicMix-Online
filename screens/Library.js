import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CreatePlaylist from '../components/library/createPlaylist';
import ShowPlaylist from '../components/library/showPlaylist';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class Library extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openPlaylist: false,
            playlistID: '',
            modalVisible: false,
            playlists: [],
        }
    }

    //Method used to add listeners when component mounts
    componentDidMount() {
        this.props.navigation.addListener('focus', this._onFocus);
        this.props.navigation.addListener('blur', this._onBlur);
    }
    
    //method used to remove listeners when component unmounts
    componentWillUnmount() {
        this.props.navigation.removeListener('blur', this._onBlur);
        this.props.navigation.removeListener('focus', this._onFocus);
    }

    //Listener method fired up when tab is focused
    _onFocus = async () => {
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');
        var userID = await AsyncStorage.getItem('ID');

        //Fetching tops
        await axios
        .get('http://api.music-mix.live/playlists/users/'+userID+"", 
            { headers: { 
                Authorization: 'Bearer '+token 
            }})
        .then(res => {
            this.setState({playlists: res.data.response.playlist})
        })
        //else log error
        .catch(error => {
            console.log("error " + error);
        });
    }

    //Method fired up when users tabs away
    _onBlur = () => {
        this.setState({playlists: []});
    }

    //method used to close createPlaylist modal
    closeModal = () => {
        this.setState({modalVisible: false});
    }

    //method used to open createPlaylist modal
    openModal = () => {
        this.setState({modalVisible: true});
    }

    openPlaylist = (id) => {
        this.setState({openPlaylist: true, playlistID: id});
    }

    closePlaylist = () => {
        this.setState({openPlaylist: false});
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
                        <TouchableOpacity style={styles.userPlaylistContainer} onPress={() => this.openPlaylist(id)}>
                            <Image style={styles.userPlaylistImage} source={{uri: item.image}}/>
                            <Text style={styles.userPlaylisName}>{item.name}</Text>
                        </TouchableOpacity>
                    } 
                />

                <ShowPlaylist 
                    playlistVisible={this.state.openPlaylist}
                    playlistID={this.state.playlistID}
                    closePlaylist={this.closePlaylist}
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
        resizeMode: 'stretch',
    },
    userPlaylisName: {
        color: '#00758a',
        fontSize: 20,
    },
});