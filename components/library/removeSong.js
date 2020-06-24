import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class RemoveSong extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userPlaylists: [],
            songRemovedMsg: false,
        }
    }

    async removeSong() {
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');
        //Variable that holds user id found in storage
        var userID = await AsyncStorage.getItem('ID');
        var url = "http://api.music-mix.live/playlists/" +this.props.playlistID+"/users/"+userID+"/tracks";

        //Delete song form user playlist
        axios
        .delete(url, 
            {
            data : { track_id: this.props.songID },
            headers: { Authorization: 'Bearer '+token }})
        .then(response => {
            //If response ok then do following
            if (response.status === 200) {
                this.setState({songRemovedMsg: true});

                setTimeout(() => {
                    this.setState({songRemovedMsg: false})
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
            animationType='slide'
            visible={this.props.visible}
            transparent={true}
            swipeDirection='down'
            swipeTreshold={90}
            onSwipeComplete={() => this.props.closeModal()}
            >
                <View style={styles.modalBackContainer}>

                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5,}}>
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />

                        <Text style={{color: 'darkcyan', marginHorizontal: '3%'}}>Swipe down to close</Text>

                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                    </View>

                    <View style={styles.modalContainer}>

                        <View style={styles.playlistListContainer}>

                            <TouchableOpacity onPress={() => this.removeSong()}>
                                <Text>Remove song from playlist</Text>
                            </TouchableOpacity>

                            {this.state.songRemovedMsg ? (
                                <Text style={styles.successMsg}>Song successfully removed from playlist!</Text>
                            ) : (<Text style={styles.successMsg}></Text>)}

                        </View>
                            

                        {this.props.artistsID[1] == null ? (
                            <View>
                                <Text  style={styles.headers}>See artist:</Text>

                                <TouchableOpacity style={styles.links} onPress={() => this.props.showArtist(this.props.artistsID[0])}>
                                    <Text style={styles.artistName}>{this.props.artistsName}</Text>
                                </TouchableOpacity>
                            </View>
                        ) : ( 
                            <View>
                                <Text  style={styles.headers}>See artist:</Text>

                                <TouchableOpacity style={styles.links} onPress={() => this.props.showArtist(this.props.artistsID[0])}>
                                    <Text style={styles.artistName}>{this.props.artistsName.split(' & ')[0]}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.links} onPress={() => this.props.showArtist(this.props.artistsID[1])}>
                                    <Text style={styles.artistName}>{this.props.artistsName.split(' & ')[1]}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

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
        marginVertical: '40%',
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
        maxHeight: '50%',
        borderBottomWidth: 2,
    },
    playlists: {
        fontWeight: 'bold',
        marginBottom: '5%',
        fontSize: 16,
    },
    artistName: {
        fontWeight: 'bold',
        marginBottom: '5%',
        fontSize: 16,
    },
  });