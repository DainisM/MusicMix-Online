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
                {name: 'Rock', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Pop', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Metal', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Alternative', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Electro', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'House', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Hip Hop', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Rap', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Reggea', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
            ],
            moods: [
                {name: 'Chill', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Motivation', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Workout', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Car', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Party', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
            ],
            tops: [
                {name: 'Newest tracks', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Top of last 10 years', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
                {name: 'Editors to 15', image: 'C:/Users/damo/Desktop/MusicMix - Mobile app/Music.png',},
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
                        keyExtractor={item => item.name}
                        renderItem={({item}) => 
                        <TouchableOpacity style={styles.browseTouchables} key={item.name}>
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
                        keyExtractor={item => item.name}
                        renderItem={({item}) => 
                        <TouchableOpacity style={styles.browseTouchables} key={item.name}>
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
                        keyExtractor={item => item.name}
                        renderItem={({item}) => 
                        <TouchableOpacity style={styles.browseTouchables} key={item.name}>
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