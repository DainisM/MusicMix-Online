import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Dimensions} from 'react-native';
import Player from '../components/player/player';
import AddToPlaylist from '../components/player/addToPlaylist';
import ShowArtistInfo from '../components/player/showArtistInfo';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class Artist extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            artistName: '',
            artistType: '',
            artistCarrier: null,
            artistLocation: '',
            artistActive: '',
            artistImage: '',
            artistLink: '',
            artistDescription: '',
            infoVisible: false,
            playerVisible: false,
            modalVisible: false,
            isPlaying: false,
            id: this.props.route.params.id,
            name: this.props.route.params.name,
            url: '',
            songs: [],
            currentSong: '',
        }
    }

    componentDidMount() {
        this.renderArtist();
        this.getArtistSongs();
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
    }

    //Method used to reset Track player and erease song array when component unmounts
    componentWillUnmount() {
        this.setState({songs: [], currentSong: ''});
        TrackPlayer.reset();
    }

    //Method used to get all song for the current artist
    async getArtistSongs () {
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');

                //Fetching artist songs
                await axios
                .get('http://api.music-mix.live/artists/tracks/'+this.props.route.params.artistID, 
                    { headers: { 
                        Authorization: 'Bearer '+token 
                    }})
                .then(res => {
                    //Mapping data
                    res.data.tracks.map((tracks) => {
                        //if there is 2 artist in array then we set is together in 1 string
                        let artistName = '';
                        if (tracks.artist[1] != null) {
                            artistName = tracks.artist[0] + ' & '+tracks.artist[1]
                        } 
                        //Or just set it as 1 string
                        else {
                            artistName = tracks.artist[0]
                        }

                        //Getting old array
                        let oldArray = [...this.state.songs]
                        
                        //Pushing new object in array
                        oldArray.push({id: tracks._id, artist: artistName, title: tracks.name, explicit: tracks.explicit, url: tracks.url});

                        //Setting array to state
                        this.setState({songs: oldArray});
                    })
                })
                //else log error
                .catch(error => {
                    console.log("error " + error);
                });
        this.setup();
    }

    async renderArtist() {
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');

        axios
            .get('http://api.music-mix.live/artists/'+ this.props.route.params.artistID, 
                { headers: { 
                    Authorization: 'Bearer '+token 
                }})
            .then(res => {
                this.setState({
                    artistName: res.data.name,
                    artistType: res.data.details.type,
                    artistCarrier: res.data.details.carrier_start,
                    artistLocation: res.data.details.location,
                    artistActive: res.data.details.active,
                    artistImage: res.data.urls.image,
                    artistLink: res.data.urls.external_url,
                    artistDescription: res.data.description,
                });
            })
            //else log error
            .catch(error => {
                console.log("error " + error);
            });
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
        });
    }

    //Method for closing info
    closeInfo = () => {
        this.setState({infoVisible: false});
    }

    //Method for setting state (opening modal)
    openModal (song) {
        this.setState({
            modalVisible: true,
            songID: song,
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity style={styles.backButton} onPress={() => this.props.navigation.goBack()}>
                    <Icon 
                        name='reply'
                        size={34}
                        color={'darkcyan'}
                    />
                </TouchableOpacity>

                <View>
                    <View style={{flexDirection: 'row', alignSelf: 'center',}}>
                        <Text style={styles.headerText}>{this.state.artistName}</Text>

                        <TouchableOpacity onPress={() => this.setState({infoVisible: true})}>
                            <Icon 
                                name='info-circle'
                                size={24}
                                color='darkcyan'
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <Image style={styles.image} source={{uri: this.state.artistImage}}/>
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

                        <TouchableOpacity style={styles.songLinks} 
                            onPress={() => this.openModal(item.id)}
                        >
                            <Icon 
                                name="ellipsis-v"
                                size={30}
                            />
                        </TouchableOpacity>

                    </View>
                    }
                />

                <AddToPlaylist 
                    visible={this.state.modalVisible}
                    songID={this.state.songID}
                    closeModal={this.closeModal}
                />

                

                <ShowArtistInfo 
                    infoOpen={this.state.infoVisible}
                    closeInfo={this.closeInfo}
                    artistType={this.state.artistType}
                    artistCarrier={this.state.artistCarrier}
                    artistLocation={this.state.artistLocation}
                    artistActive={this.state.artistActive}
                    artistLink={this.state.artistLink}
                    artistDescription={this.state.artistDescription}
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
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
    headerText: {
        alignSelf: 'center',
        marginVertical: '3%',
        marginHorizontal: '7%',
        fontWeight: 'bold',
        fontSize: 20,
        color: '#00cccc',
    },
    image: {
        alignSelf: 'center',
        resizeMode: 'contain',
        width: deviceWidth / 1,
        height: deviceHeigh / 3.5,
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