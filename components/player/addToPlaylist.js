import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, Modal, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class AddToPlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userPlaylists: [],
            songAddedMsg: false,
        }
    }

    async componentDidUpdate(nextProps) {
        if (nextProps.visible === false && this.props.visible !== false) {
            //Variable that holds JWT token found in storage
            var token = await AsyncStorage.getItem('Token');

            axios
                .get('http://api.music-mix.live/playlists/users/'+ await AsyncStorage.getItem('ID'), 
                    { headers: { 
                        Authorization: 'Bearer '+token 
                    }})
                .then(res => {
                    this.setState({userPlaylists: res.data.response.playlist});
                })
                //else log error
                .catch(error => {
                    console.log("error " + error);
                });
        }
    }

    async addToPlaylist(playlistid) {      
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');
        //Variable that holds user id found in storage
        var userID = await AsyncStorage.getItem('ID');
        var url = "http://api.music-mix.live/playlists/" +playlistid+"/users/"+userID+"/tracks";

        //Patch user playlist (add song to playlist)
        axios
        .patch(url, 
            {
                track_id: this.props.songID
            },  { headers: { Authorization: 'Bearer '+token }, },)
        .then(async response => {
            //If response ok then do following
            if (response.status === 200) {
                this.setState({songAddedMsg: true});

                setTimeout(() => {
                    this.setState({songAddedMsg: false})
                }, 1000)
            }
        })
        //else log error
        .catch(error => {
            console.log("error " + error);
        });
    }

    render() {
        return (
            <Modal
            style={styles.playlistModal}
            animationType='fade'
            visible={this.props.visible}
            transparent={true}
            >
                <View style={styles.modalBackContainer}>
                    <View style={styles.modalContainer}>

                        <TouchableOpacity style={styles.backButton} onPress={this.props.closeModal}>
                            <Icon 
                                name='reply'
                                size={24}
                            />
                        </TouchableOpacity>


                        <View style={styles.playlistListContainer}>
                            <Text style={styles.headers}>Add song to playlist:</Text>

                            <FlatList 
                                data={this.state.userPlaylists}
                                keyExtractor={item => item._id}
                                renderItem={({item}) => 
                                    <View key={item._id}>
                                        <TouchableOpacity style={styles.links} onPress={() => this.addToPlaylist(item._id)}>
                                            <Text style={styles.playlists}>{item.name}</Text>
                                        </TouchableOpacity>
                
                                    </View>
                                }
                            /> 

                        </View>     

                        {this.state.songAddedMsg ? (
                            <Text style={styles.successMsg}>Song added to playlist!</Text>
                        ) : (<Text style={styles.successMsg}></Text>)}

                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
		justifyContent: 'space-between',
		alignItems: 'center',
		alignSelf: 'stretch',
        backgroundColor: '#ccfffd',
        height: '100%'
    },
    modalBackContainer: {
        backgroundColor: '#000000aa',
        flex: 1, 
    },
    modalContainer: {
        alignSelf: 'center',
        marginVertical: '30%',
        backgroundColor: 'lightblue' ,
        width: '80%',
        padding: 20, 
        borderRadius: 10,
        flex: 1, 
    },
    successMsg: {
        marginVertical: '3%',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'darkcyan',
        alignSelf: 'center',
    },
    backButton: {
        marginVertical: '5%',
    },
    headers: {
        fontStyle: 'italic',
        fontSize: 18,
        marginVertical: '5%',
    },
    links: {
        marginLeft: '5%',
    },
    playlistListContainer: {
        maxHeight: '70%',
        borderBottomWidth: 2,
    },
    playlists: {
        fontWeight: 'bold',
        marginBottom: '5%',
        fontSize: 16,
    },
  });