import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TrackPlayer, {usePlaybackState} from 'react-native-track-player';
import Player from '../components/player';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class Library extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            playerVisible: false,
            isPlaying: false,
            id: this.props.route.params.id,
            name: this.props.route.params.name,
            url: '',
            songs: [],
            currentSong: '',
        }
    }

    //Method used to add listeners when component mounts
    componentDidMount() {
        this.props.navigation.addListener('focus', this._onFocus);
        this.props.navigation.addListener('blur', this._onBlur);
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
    
    //method used to remove listeners when component unmounts
    componentWillUnmount() {
        this.props.navigation.removeListener('blur', this._onBlur);
        this.props.navigation.removeListener('focus', this._onFocus);
    }

    //Listener method fired up when tab is focused
    _onFocus = async () => {
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');

        if (this.props.route.params.from == 'Featured') {
            if (this.props.route.params.name !== 'Newest Tracks') {
                //Fetching tops
                await axios
                .get('http://api.music-mix.live/browse/tops/'+this.props.route.params.id, 
                    { headers: { 
                        Authorization: 'Bearer '+token 
                    }})
                .then(res => {
                    //Mapping data
                    res.data.response.top[0].tracks.map((track) => {
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
                        oldArray.push({id: track._id, artist: artistName, title: track.name, explicit: track.explicit, url: trackUrl});

                        //Setting array to state
                        this.setState({songs: oldArray});
                    })
                })
                //else log error
                .catch(error => {
                    console.log("error " + error);
                });
            } else {
                await axios
                .get(
                    "http://api.music-mix.live/browse/newest/",
                    {
                    headers: { Authorization: 'Bearer '+token }
                    }
                )
                .then(res => {
                    res.data.tracks.map((track) => {
                        //if there is 2 artist in array then we set is together in 1 string
                        let artistName = '';
                        if (track.artist[1] != null) {
                            artistName = track.artist[0] + ' & '+track.artist[1]
                        } else {
                            artistName = track.artist[0]
                        }

                        //Getting old array
                        let oldArray = [...this.state.songs]

                        //Pushing new object in array
                        oldArray.push({id: track._id, artist: artistName, title: track.name, explicit: track.explicit, url: track.url});

                        //Setting array to state
                        this.setState({songs: oldArray});
                    })
                
                })
                .catch(error => {
                    console.log("error " + error);
                });
            }
        }
        if (this.props.route.params.from == 'Genres') {
           //Fetching genres
           await axios
           .get('http://api.music-mix.live/browse/genres/tracks/'+this.props.route.params.name.toLowerCase(), 
               { headers: { 
                   Authorization: 'Bearer '+token 
               }})
           .then(res => {

               res.data.tracks.map((track) => {
                   //if there is 2 artist in array then we set is together in 1 string
                   let artistName = '';
                   if (track.artist[1] != null) {
                       artistName = track.artist[0] + ' & '+track.artist[1]
                   } else {
                       artistName = track.artist[0]
                   }

                   //Getting old array
                   let oldArray = [...this.state.songs]
                   
                   //Pushing new object in array
                   oldArray.push({id: track._id, artist: artistName, title: track.name, explicit: track.explicit, url: track.url});

                   //Setting array to state
                   this.setState({songs: oldArray});
               })
            })
        }
        if (this.props.route.params.from == 'Moods') {
            //Fetching mooods
            await axios
            .get('http://api.music-mix.live/browse/moods/'+this.props.route.params.id, 
                { headers: { 
                    Authorization: 'Bearer '+token 
                }})
            .then(res => {
                res.data.response.playlist[0].tracks.map((track) => {
                    //if there is 2 artist in array then we set is together in 1 string
                    let artistName = '';
                    if (track.artist[1] != null) {
                        artistName = track.artist[0] + ' & '+track.artist[1]
                    } else {
                        artistName = track.artist[0]
                    }

                    //Getting old array
                    let oldArray = [...this.state.songs]
                    
                    //Appending 1. halv of link for song to other gotten from API (fail in API)
                    let trackUrl = 'http://api.music-mix.live' +track.url.split('..')[1]

                    //Pushing new object in array
                    oldArray.push({id: track._id, artist: artistName, title: track.name, explicit: track.explicit, url: trackUrl});

                    //Setting array to state
                    this.setState({songs: oldArray});
                })
            })
            //else log error
            .catch(error => {
                console.log("error " + error);
            });
        }
        this.setup();
    }

    //Method fired up when users tabs away
    _onBlur = () => {
        this.setState({songs: [], currentSong: ''});
        TrackPlayer.reset();
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
                    <Image style={styles.image} source={{uri: this.props.route.params.image}}/>
                    <Text style={styles.headerText}>{this.state.name}</Text>                 
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

                        <TouchableOpacity style={styles.songLinks}>
                            <Icon 
                                name="ellipsis-v"
                                size={30}
                            />
                        </TouchableOpacity>

                    </View>
                    }
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