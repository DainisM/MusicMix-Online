import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-community/picker';
import axios from 'axios';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class Browse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            genres: [],
            moods: [],
            tops: [],
        }
    }


    //Method used to fetch all tops, genres and moods playlists on render
    async componentDidMount() {
        this.setState({username: await AsyncStorage.getItem('Username')})

        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');

        //Fetching tops
        await axios
            .get('http://api.music-mix.live/browse/tops', 
                { headers: { 
                    Authorization: 'Bearer '+token 
                }, },)
            .then(response => {
                this.setState({tops: response.data.tops})
                let tops = [...this.state.tops];
                tops.push({id: 'newestTracks', description: 'Here is top 20 of the newest tracks on MusicMix', links: {image: 'https://raw.githubusercontent.com/DainisM/MusicMix-web-app/master/src/app/images/NewestMusic.jpg?token=AKDI27T4MUYVOOZFRSIME3S66MHEM'}, name: 'Newest Tracks'})
                this.setState({tops: tops});

            })
            //else log error
            .catch(error => {
                console.log("error " + error);
            });


        //Fetching genres
        await axios
        .get('http://api.music-mix.live/browse/genres', 
            { headers: { 
                Authorization: 'Bearer '+token 
            }, },)
        .then(response => {
            this.setState({genres: response.data.genres})

        })
        //else log error
        .catch(error => {
            console.log("error " + error);
        });

        //Fetching moods
        await axios
        .get('http://api.music-mix.live/browse/moods', 
            { headers: { 
                Authorization: 'Bearer '+token 
            }, },)
        .then(response => {
            this.setState({moods: response.data.moods})

        })
        //else log error
        .catch(error => {
            console.log("error " + error);
        });

    }

    //Method used to navigate to pofile or logout when dropdown item is pressed
    dropdown = async (value) => {

        if (value === 'profile') {
            this.props.navigation.navigate('Profile');
        }

        if(value === 'logout') {
            await AsyncStorage.clear();
            this.props.navigation.replace('Welcome')
        }
    } 

    render() {
        return (
            <View style={styles.container}>
                
                <View style={styles.profileLinkContainer}>
                    <Icon 
                        name='user'
                        size={30}
                        color={'#00758a'}
                    />

                    <Picker
                        mode={'dropdown'}
                        style={{ height: 30, width: 180, backgroundColor: 'transparent', alignSelf: 'center'}}
                        onValueChange={(itemValue, itemIndex) => this.dropdown(itemValue)}
                    >
                        <Picker.Item label={this.state.username} value='0' color='darkcyan'/>
                        <Picker.Item label='Profile' value='profile'/>
                        <Picker.Item label='Logout' value='logout'/>
                    </Picker>

                </View>
                
                <View style={styles.browseContainers}>
                    <Text style={styles.browseText}>Featured</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        data={this.state.tops}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => 
                        <TouchableOpacity style={styles.browseTouchables} key={item.id} onPress={() => this.props.navigation.navigate('Playlist', {id: item.id, name: item.name, from: 'Featured'})}>
                            <Image style={styles.browseImages} source={{uri: item.links.image}} />
                            <Text style={styles.browseItemNames}>{item.name}</Text>
                        </TouchableOpacity>} 
                    />
                </View>

                <View style={styles.browseContainers}>
                    <Text style={styles.browseText}>Genres</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        scrollEventThrottle={200}
                        decelerationRate="fast"
                        data={this.state.genres}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => 
                        <TouchableOpacity style={styles.browseTouchables} key={item.id} onPress={() => this.props.navigation.navigate('Playlist', {id: item.id, name: item.name, from: 'Genres'})}>
                            <Image style={styles.browseImages} source={{uri: item.links.image}} />
                            <Text style={styles.browseItemNames}>{item.name}</Text>
                        </TouchableOpacity>} 
                    />
                </View>

                <View style={styles.browseContainers}>
                    <Text style={styles.browseText}>Moods</Text>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled={true}
                        scrollEventThrottle={200}
                        decelerationRate="fast"
                        data={this.state.moods}
                        keyExtractor={item => item.id}
                        renderItem={({item}) => 
                        <TouchableOpacity style={styles.browseTouchables} key={item.id} onPress={() => this.props.navigation.navigate('Playlist', {id: item.id, name: item.name, from: 'Moods'})}>
                            <Image style={styles.browseImages} source={{uri: item.links.image}} />
                            <Text style={styles.browseItemNames}>{item.name}</Text>
                        </TouchableOpacity>} 
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
    profileLinkContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        paddingVertical: '3%',
        marginHorizontal: '5%',
        height: '10%',
    },
    profileLinkUsername: {
        color: '#00758a',
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: '2%',
        alignSelf: 'center',
    },
    browseContainers: {
        height: '30%',
        width: deviceWidth,
    },
    browseTouchables: {
        width: deviceWidth / 3, 
        alignItems:'center',
    },
    browseText: {
        fontWeight: 'bold',
        color: 'darkcyan',
        fontSize: 36,
        marginLeft: '3%',
    },
    browseImages: {
        height: deviceHeigh / 8, 
        width: deviceWidth / 4,
    },
    browseItemNames: {
        color: '#00758a',
        fontWeight: 'bold',
        fontSize: 18,
        marginHorizontal: 10,
    },
});