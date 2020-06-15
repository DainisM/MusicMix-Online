import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import {Picker} from '@react-native-community/picker';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class Browse extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            genres: [
                {id: 1234545454, name: 'Rock', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545484, name: 'Pop', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545419, name: 'Metal', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545413, name: 'Alternative', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545464, name: 'Electro', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545487, name: 'House', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545458, name: 'Hip Hop', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545497, name: 'Rap', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
                {id: 1234545444, name: 'Reggea', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png'},
            ],
            moods: [
                {id: 1234545984, name: 'Chill', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {id: 1234545944, name: 'Motivation', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {id: 1234545464, name: 'Workout', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {id: 1234545914, name: 'Car', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {id: 1234545244, name: 'Party', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
            ],
            tops: [
                {id: 1234545816, name: 'Newest tracks', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {id: 1234545759, name: 'Top of last 10 years', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {id: 1234545555, name: 'Editors top 15', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
            ]
        }
    }

    async componentDidMount() {
        this.setState({username: await AsyncStorage.getItem('Username')})
    }

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
                        <Picker.Item label='USERNAME00' value='0' color='darkcyan'/>
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
                            <Image style={styles.browseImages} source={require('../assets/Music.png')} />
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
                            <Image style={styles.browseImages} source={require('../assets/Music.png')} />
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
                            <Image style={styles.browseImages} source={require('../assets/Music.png')} />
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
        justifyContent: 'flex-end',
        paddingVertical: '3%',
        height: '10%',
        // marginRight: 5,
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
    },
});