import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import RemoveSong from './removeSong';
import Player from '../player/player';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class ShowPlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlist: [],
            playlistName: '',
            playlistImage: '',
            playlistDescription: '',
            showDescription: false,
            songs: [],
            playerVisible: false,
            modalVisible: false,
            isPlaying: false,
            currentSong: '',
            songID: '',
            artistsID: [],
            artistName: '',
        }
    }

    async componentDidUpdate(nextProps) {
        if (nextProps.playlistVisible === false && this.props.playlistVisible !== false) {
            this.renderPlaylistSongs();            
        }
    }

    async renderPlaylistSongs() {
        this.setState({playlist: [],
            songs: [],
            playerVisible: false,
            modalVisible: false,
            isPlaying: false,
            showDescription: false,
        })

        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');

        await axios
            .get('http://api.music-mix.live/playlists/'+this.props.playlistID+'/users/'+ await AsyncStorage.getItem('ID'), 
                { headers: { 
                    Authorization: 'Bearer '+token 
                }})
            .then(res => {

                this.setState({
                    playlist: res.data.response.playlist,
                    playlistName: res.data.response.playlist[0].name,
                    playlistImage: res.data.response.playlist[0].image,
                    playlistDescription: res.data.response.playlist[0].description,
                });

                res.data.response.playlist[0].tracks.map((track) => {
                    //if there is 2 artist in array then we set is together in 1 string
                    let artistName = '';
                    if (track.artist[1] != null) {
                        artistName = track.artist[0] + ' & '+track.artist[1]
                    } 
                    //Or just set it as 1 string
                    else {
                        artistName = track.artist[0]
                    }

                    //Getting old array
                    let oldArray = [...this.state.songs]
                    
                    //Appending 1. halv of link for song to other gotten from API (fail in API)
                    let trackUrl = 'http://api.music-mix.live' +track.url.split('..')[1]

                    //Pushing new object in array
                    oldArray.push({id: track._id, artist: artistName, title: track.name, explicit: track.explicit, url: trackUrl, artistID: track.artist_id});

                    //Setting array to state
                    this.setState({songs: oldArray});
                })
            })
            //else log error
            .catch(error => {
                console.log("error " + error);
            });

        TrackPlayer.addEventListener('remote-play', async () => {
            this.setState({playerVisible: true});
        });
        TrackPlayer.addEventListener('remote-next', async () => {
            //Calling method to get current song ID
            this.getSongID();
        });
        TrackPlayer.addEventListener('remote-previous', async () => {
            //Calling method to get current song ID
            this.getSongID();
        });
        TrackPlayer.addEventListener('playback-track-changed', async () => {
            //Calling method to get current song ID
            this.getSongID();
        })

        this.setup();
    }

    //Method used to initialize Track player
    async setup() {
        //Ading array of songs to Track player
        await TrackPlayer.setupPlayer({}).then(async () => {
            await TrackPlayer.add(this.state.songs);
            //Calling method to get current song ID
            this.getSongID();
        });
        //initializing Track player options such as caabilities (notification controls)
        await TrackPlayer.updateOptions({
            stopWithApp: true,
            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            ],
            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
            ]
        });
    }

    //Method used to get current track ID and set it into the state
    getSongID = async () => {
        const currentSongID = await TrackPlayer.getCurrentTrack();
        this.setState({currentSong: currentSongID});
    }

    //Method used to toggle between play and pause
    async togglePlayback() {
        //Getting current state
        const currentState = TrackPlayer.getState();
        //Getting current track
        const currentTrack = await TrackPlayer.getCurrentTrack();
        //If there is no track then initialize it from state and start playing
        if (currentTrack === null) {
          await TrackPlayer.reset();
          await TrackPlayer.add(this.state.songs);
          await TrackPlayer.play();
        } else {
        //If state is paused them toggle play otherwise toggle pause
          if (currentState._55 === TrackPlayer.STATE_PAUSED) {
            await TrackPlayer.play();
          } else {
            await TrackPlayer.pause();
          }
        }
    }

    //Method used to get and represend different playback states
    getStateName = () => {
        const state = usePlaybackState();

        switch (state) {
          case TrackPlayer.STATE_NONE:
            return "None";
          case TrackPlayer.STATE_PLAYING:
            return "Playing";
          case TrackPlayer.STATE_PAUSED:
            return "Paused";
          case TrackPlayer.STATE_STOPPED:
            return "Stopped";
          case TrackPlayer.STATE_BUFFERING:
            return "Buffering";
        }
    }
      
    //Method used to skip to next song in array
    skipToNext = async () => {
        try {
            await TrackPlayer.skipToNext();

            this.getSongID();
        } catch (_) {}
    }
      
    //Method used to skip to previous track in array
    skipToPrevious = async () => {
        try {
            await TrackPlayer.skipToPrevious();
            
            //Calling method to get current song ID
            this.getSongID();
        } catch (_) {}
    }

    //On click skips to song and start playing it by id and shows bottom "modal"
    async openTrack(id) {
        await TrackPlayer.skip(id);
        await TrackPlayer.play();
        //Setting this to true to show player
        this.setState({playerVisible: true});
        //Calling method to get current song ID
        this.getSongID();
    }

    //method for closing modal
    closeModal = () => {
        this.setState({
            modalVisible: false,
            songID: '',
            artistsID: [],
            artistsName: '',
        });
        this.renderPlaylistSongs();
    }

    //Method for setting state (opening modal)
    openModal (song, artistID, artistName) {
        this.setState({
            modalVisible: true,
            songID: song,
            artistsID: artistID,
            artistsName: artistName,
        });
    }

    //Method used to close modal and navigate to 'Artist' screen
    showArtist = (id) => {
        this.setState({modalVisible: false});
        this.props.showArtist(id);
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

                    <View>
                        <Image style={styles.image} source={{uri: this.state.playlistImage}}/>
                        <Text style={styles.headerText}>{this.state.playlistName}</Text>                 
                    </View>

                    <View style={styles.playlistInfo}>
                        <TouchableOpacity style={styles.infoButton} onPress={() => this.setState(prevState => ({showDescription: !prevState.showDescription}))}>
                            {this.state.showDescription ? (
                               <Icon 
                               name='times'
                               size={26}
                               color='darkcyan'
                           /> 
                            ): (
                                <Icon 
                                name='info-circle'
                                size={26}
                                color='darkcyan'
                            />
                            )}
                            
                        </TouchableOpacity>

                        {this.state.showDescription ? (
                            <ScrollView style={styles.infoDescription}>
                                <Text style={styles.infoText}>{this.state.playlistDescription}</Text>
                            </ScrollView>
                        ): (null)}

                    </View>

                    <FlatList
                    style={{marginTop: '5%'}} 
                    data={this.state.songs}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => 
                    <View style={this.state.currentSong == item.id ? styles.songContainerCurrent : styles.songContainer} key={item.id}>
                        <TouchableOpacity style={styles.songClickable}  onPress={() => this.openTrack(item.id)}>
                            
                            <Icon 
                                style={{width: '10%', marginLeft: '2%'}}
                                name="music"
                                size={30}
                            />
                    
                            <View style={{flexDirection: 'column', width: '60%'}}>
                                <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
                                <Text>{item.artist}</Text>
                            </View>

                                        
                            {item.explicit ? (
                                <Text 
                                    style={{fontWeight: 'bold', alignSelf: 'center',}}
                                >EXPLICIT</Text>
                            ) : (null)}

                        </TouchableOpacity>

                        <TouchableOpacity style={styles.songLinks} onPress={() => this.openModal(item.id, item.artistID, item.artist)}>
                            <Icon 
                                name="ellipsis-v"
                                size={30}
                            />
                        </TouchableOpacity>

                    </View>
                    }
                />

                <RemoveSong 
                    visible={this.state.modalVisible}
                    songID={this.state.songID}
                    artistsID={this.state.artistsID}
                    artistsName={this.state.artistsName}
                    closeModal={this.closeModal}
                    showArtist={this.showArtist}
                    playlistID={this.props.playlistID}
                />


                <View style={this.state.playerVisible ? ({display: 'flex', height: 120}) : ({display: 'none'})}>

                    <Player
                        onNext={this.skipToNext}
                        style={styles.player}
                        onPrevious={this.skipToPrevious}
                        onTogglePlayback={this.togglePlayback}
                        getSongID={this.getSongID}
                    />    

                </View>

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
    image: {
        alignSelf: 'center',
        resizeMode: 'contain',
        width: deviceWidth / 1,
        height: deviceHeigh / 3.5,
    },
    headerText: {
        alignSelf: 'center',
        marginVertical: '3%',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#00cccc',
    },
    playlistInfo: {
        flexDirection: 'row'
    },
    infoButton: {
        marginHorizontal: '5%',
    },
    infoDescription: {
        borderWidth: 2,
        padding: '3%',
        maxHeight: 100,
        marginRight: '5%',
        alignContent: 'center',
        backgroundColor: '#025a69',
    },
    infoText: {
        fontSize: 16,
    },
    songContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'lightblue',
        marginVertical: 5,
        paddingVertical: 5,
    },
    songContainerCurrent: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: '#5d8d9c',
        marginVertical: 5,
        paddingVertical: 5,
    },
    songClickable: {
        flexDirection: 'row',
        width: '85%',
        marginHorizontal: '3%',
    },
    songLinks: {
        alignSelf: 'center',
        justifyContent: 'center',
        marginLeft: '2%',
        paddingHorizontal: 5,
        width: '10%'
    },
  });