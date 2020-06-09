import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableWithoutFeedback, TouchableOpacity, Keyboard, FlatList} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: []
        }
    }

    searchSongs = (text) => {
        this.setState({
            search: [
                {artist: ['Linkin Park'], name: 'Numb', explicit: false},
                {artist: ["Rag 'n' Bone Man", "Calvin Harris"], name: 'Giant', explicit: true},
                {artist: ["Rammstein"], name: 'Du hast', explicit: true},
            ]
        })
    }

    render() {
        return (
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.container}>

                    <View style={styles.searchContainer}>
                        <Text style={styles.searchHeader}>Search songs and artists</Text> 

                        <TextInput 
                            style={styles.searchInput}
                            onSubmitEditing={(event) => this.searchSongs(event.nativeEvent.text)}
                        />
                    </View>


                    <View style={styles.foundSongsContainer}>
                        {!this.state.search == [] ? (
                            <FlatList
                                style={{marginTop: '5%'}} 
                                data={this.state.search}
                                keyExtractor={item => item.name}
                                renderItem={({item}) => 
                                <View style={styles.songContainer}>

                                    <TouchableOpacity style={styles.songClickable}>
                                        <Icon 
                                            style={{width: '10%', marginLeft: '2%'}}
                                            name="music"
                                            size={30}
                                        />
                                    
                                        <View style={{flexDirection: 'column', width: '60%'}}>
                                            <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                                            {item.artist.length > 1 ? (
                                                <Text>{item.artist[0]} & {item.artist[1]}</Text>
                                            ) : (
                                                <Text>{item.artist}</Text>
                                            )}
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
                        ): (null)}
                    </View>

                </View>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002930',
    },
    searchContainer: {
        height: '20%',
    },
    searchHeader: {
        fontWeight: 'bold',
        color: 'darkcyan',
        fontSize: 30,
        alignSelf: 'center',
        marginVertical: '2%',
    },
    searchInput: {
        backgroundColor: '#99bdbd',
        borderRadius: 20,
        marginHorizontal: '5%',
        fontSize: 20,
    },
    foundSongsContainer: {
        height: '80%',
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
});