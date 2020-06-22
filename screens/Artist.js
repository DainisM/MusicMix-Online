import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking, Image, Dimensions, ScrollView} from 'react-native';
import Player from '../components/player/player';
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

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
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

                        <TouchableOpacity>
                            <Icon 
                                name='info-circle'
                                size={24}
                                color='darkcyan'
                            />
                        </TouchableOpacity>
                    </View>
                    
                    <Image style={styles.image} source={{uri: this.state.artistImage}}/>
                    {/* <Text>{this.state.artistType}</Text>
                    <Text>{this.state.artistCarrier}</Text>
                    <Text>{this.state.artistLocation}</Text>
                    <Text>{this.state.artistActive}</Text>
                    <Text onPress={() => Linking.openURL(this.state.artistLink)}>{this.state.artistLink}</Text>
                    <Text>{this.state.artistDescription}</Text> */}
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
                            // onPress={() => this.openModal(item.id, item.artistID, item.artist)}
                        >
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

                </ScrollView>
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