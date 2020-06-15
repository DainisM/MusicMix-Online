import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TrackPlayer from 'react-native-track-player';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

const FeaturedURL = 'https://music-mix.live/browse/tops/';
const GenreURL = 'https://music-mix.live/browse/genres/';
const MoodsURL = 'https://music-mix.live/browse/moods/';

export default class Library extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalVisible: false,
            isPlaying: false,
            id: this.props.route.params.id,
            name: this.props.route.params.name,
            url: '',
            songs: [
                {id: '123', artist: 'Morgenshtern', title: 'Caddilac', explicit: true, url: 'file:///storage/emulated/0/Download/Morgenshtern - Cadillac.mp3'},
                {id: '132', artist: 'Timati', title: 'Havchik', explicit: false, url: 'file:///storage/emulated/0/Download/Timati - Havchik.mp3'},
                {id: '213', artist: 'Filv', title: 'Balenciaga', explicit: false, url: 'file:///storage/emulated/0/Download/Filv - Balenciaga.mp3'},
                {id: '321', artist: 'Audiosoulz', title: 'Dancefloor', explicit: false, url: 'file:///storage/emulated/0/Download/Audiosoulz - Dancefloor.mp3'},
                {id: '231', artist: 'Amaranthe', title: '365', explicit: false, url: 'file:///storage/emulated/0/Download/Amaranthe - 365.mp3'},
                {id: '312', artist: 'TRITIA', title: 'Wake', explicit: false, url: 'file:///storage/emulated/0/Download/TRITIA - Wake.mp3'},
                {id: '412', artist: 'Amaranthe', title: 'Digital World', explicit: false, url: 'file:///storage/emulated/0/Download/Amaranthe - Digital World.mp3'}
            ],
        }
    }

    async componentDidMount() {
        if (this.props.route.params.from == 'Featured') {
            const url = FeaturedURL+this.props.route.params.id;
            this.setState({url: url});
        }
        if (this.props.route.params.from == 'Genres') {
            const url = GenreURL+this.props.route.params.name.toLowerCase();
            this.setState({url: url});
        }
        if (this.props.route.params.from == 'Moods') {
            const url = MoodsURL+this.props.route.params.id;
            this.setState({url: url});
        }
    }

    // isPlaying = async () => {
    //     const currentState = await TrackPlayer.getState()
    //     return currentState === TrackPlayer.STATE_PLAYING
    // }

    // togglePlay = async () => {
    //     const isPlaying = await this.isPlaying()

    //     if (isPlaying) {
    //         return TrackPlayer.pause(), this.setState({isPlaying: false});
    //     } else {
    //         return TrackPlayer.play(), this.setState({isPlaying: true});
    //     }
    // }

    // next = () => TrackPlayer.skipToNext();

    // previous = () => TrackPlayer.skipToPrevious();

    openTrack(id) {
        // TrackPlayer.skip(id);
        this.setState({modalVisible: true})
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
                    <Image style={styles.image} source={require('../assets/Playlist.png')}/>
                    <Text style={styles.headerText}>{this.state.name}</Text>                   
                </View>

                <FlatList
                    style={{marginTop: '5%'}} 
                    data={this.state.songs}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => 
                    <View style={styles.songContainer}>

                        <TouchableOpacity style={styles.songClickable} onPress={() => this.openTrack(item.id)}>
                            <Icon 
                                style={{width: '10%', marginLeft: '2%'}}
                                name="music"
                                size={30}
                            />
                                    
                            <View style={{flexDirection: 'column', width: '60%'}}>
                                <Text style={{fontWeight: 'bold'}}>{item.title}</Text>
                                {/* {item.artist.length > 1 ? (
                                    <Text>{item.artist[0]} & {item.artist[1]}</Text>
                                ) : (
                                    <Text>{item.artist}</Text>
                                )} */}
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

                    </View>}
                />


                <View style={this.state.modalVisible ? ({display: 'flex', height: 100}) : ({display: 'none'})}>
                    
                    <View>
                        <TouchableOpacity onPress={this.previous}>
                            <Icon 
                                    name="backward"
                                    size={20}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.togglePlay}>

                            {this.state.isPlaying ? (
                                <Icon 
                                    name="pause"
                                    size={20}
                                />
                            ) : (
                                <Icon 
                                    name="play"
                                    size={20}
                                />
                            )}
                            
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.next}>
                            <Icon 
                                    name="forward"
                                    size={20}
                            />
                        </TouchableOpacity>
                    </View>

                   
                    
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
        width: deviceWidth / 1.3,
        height: deviceHeigh / 3,
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
    modal: {
        justifyContent: "flex-end",
        margin: 0,
    },
    modalContainer: {
        position: 'absolute',
        bottom: 0,
        height: 100,
    },
});