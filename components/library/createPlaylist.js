import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

const PostData = new FormData();

export default class CreatePlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlistName: '',
            playlistDescription: '',
            playlistImage: '',
            playlistNameError: '',
            playlistDescriptionError: '',
            successMsg: false,
        }
    }

    async componentDidUpdate(nextProps) {
        if (nextProps.ModalVisible === false && this.props.ModalVisible !== false) {
                 
        }
    }

    validate = () => {
        if (this.state.playlistName.length <= 3 || this.state.playlistName.length >= 20) {
            this.setState({playlistNameError: 'Name must be between 3 and 20 characters long!'});
            return false;
        }

        if (this.state.playlistDescription.length > 150) {
            this.setState({playlistDescriptionError: 'Description can be max 150 characters long!'});
            return false;
        }
            
        return true;
        
    }

    mageGalleryLaunch = () => {
        let options = {
          storageOptions: {
            skipBackup: true,
            path: 'images',
          },
        };
      
        ImagePicker.launchImageLibrary(options, (res) => {
            PostData.append('image', res);
            this.setState({
                playlistImage: 'file://'+res.path
            });
        });
    }

    async createNewPlaylist() {

        const isValid = this.validate();

        if(isValid) {

            //Variable that holds JWT token found in storage
            var token = await AsyncStorage.getItem('Token');
            //Variable that holds user id found in storage
            var userID = await AsyncStorage.getItem('ID');
            var posturl = "http://api.music-mix.live/playlists/users/"+userID+""
            // const request = new Request(posturl);
            // const header = new Headers();
            // header.append("Authorization", "Bearer " + token);
            // header.append('Content-Type', 'multipart/form-data');

            PostData.append('name', this.state.playlistName);
            PostData.append('description', this.state.playlistDescription);

            console.log(PostData);

            //Patch user data
            axios
            .post(posturl, 
                { PostData },  
                { headers: { Authorization: 'Bearer '+token }, },)
            .then(response => {
                console.log(response);
                //If response ok then do following
                if (response.status === 201) {
                    //set successMsg to true
                    this.setState({ successMsg: true });
                    //After 1 second redirect to home page
                    setTimeout(() => {
                        this.setState({ successMsg: false });
                        this.props.closeModal();
                    }, 1000)
                }
            })
            //else log error
            .catch((error) => {
                console.log(error);
            });

            this.setState({
                playlistName: '',
                playlistDescription: '',
                playlistImage: null,
                playlistNameError: '',
                playlistDescriptionError: '',
            })
        }
    }
    
    
    closePlaylistModal() {
        this.props.closeModal();

        this.setState({
            playlistName: '',
            playlistDescription: '',
            playlistImage: null,
            playlistNameError: '',
            playlistDescriptionError: '',
        })
    }

    render() {
        return (
                <Modal
                    style={styles.playlistModal}
                    animationType='fade'
                    visible={this.props.ModalVisible}
                    transparent={true}
                >
                    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                        <View style={styles.modalBackContainer}>
                            <View style={styles.modalContainer}>

                                <View style={styles.playlistRow}>
                                    <Text style={styles.playlistLabel}>Playlist name:</Text>
                                    <TextInput
                                        autoCorrect={false}
                                        style={styles.playlistNameInput}
                                        onChangeText={(text) => this.setState({playlistName: text, playlistNameError: ''})}
                                        value={this.state.playlistName}
                                    />
                                    {!this.state.playlistNameError == '' ? (
                                        <Text style={styles.errorText}>{this.state.playlistNameError}</Text>
                                    ) : null}
                                </View>

                                <View style={styles.playlistRow}>
                                    <Text style={styles.playlistLabel}>Playlist description:</Text>
                                    <TextInput
                                        multiline={true}
                                        autoCorrect={false}
                                        style={styles.playlistDescriptionInput}
                                        onChangeText={(text) => this.setState({playlistDescription: text, playlistDescriptionError: ''})}
                                        value={this.state.playlistDescription}
                                    />
                                    {!this.state.playlistDescriptionError == '' ? (
                                        <Text style={styles.errorText}>{this.state.playlistDescriptionError}</Text>
                                    ) : null}
                                </View>


                                <View style={styles.playlistRow}>
                                    <Text style={styles.playlistLabel}>Choose a image:</Text>

                                    <View style={styles.chooseImage}>
                                        <TouchableOpacity style={styles.buttonImage} onPress={this.mageGalleryLaunch}>
                                        <   Text style={styles.buttonText}>Browse</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.imagePath}>{this.state.playlistImage}</Text>
                                    </View>
                                    
                                    {!this.state.playlistDescriptionError == '' ? (
                                        <Text style={styles.errorText}>{this.state.playlistDescriptionError}</Text>
                                    ) : null}
                                </View>

                                <View style={styles.butonContainer}>
                                    <TouchableOpacity style={styles.buttonCancel} onPress={() => this.closePlaylistModal()}>
                                        <Text style={styles.buttonText}>Close</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.buttonCreate} onPress={() => this.createNewPlaylist()}>
                                        <Text style={styles.buttonText}>Create</Text>
                                    </TouchableOpacity>
                                </View>

                                {this.state.successMsg ? (
                                    <Text style={styles.successMsg}>Playlist created!</Text>
                                ) : (null)}

                            </View>
                        </View>
                    </TouchableWithoutFeedback>
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
        marginVertical: '35%',
        backgroundColor: '#fff' ,
        width: '70%',
        height: deviceHeigh / 1.7,
        padding: 20,
        borderRadius: 10,
    },
    playlistRow: {
        marginVertical: '2%',
    },
    playlistLabel: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    playlistNameInput: {
        fontSize: 16,
        borderBottomWidth: 1,
        padding: 2,
        marginVertical: '3%',
    },
    playlistDescriptionInput: {
        fontSize: 16,
        borderWidth: 1,
        padding: 2,
        marginVertical: '3%',
        maxHeight: 80,
    },
    butonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '10%',
    },
    chooseImage: {
        flexDirection: 'row',
    },
    buttonImage: {
        width: 80,
        padding: 10,
        backgroundColor: 'lightblue',
        borderRadius: 10,
    },
    buttonCancel: {
        alignItems: 'center',
        width: 100,
        padding: 10,
        backgroundColor: 'darkgrey',
        borderRadius: 10,
    },
    buttonCreate: {
        alignItems: 'center',
        width: 100,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        alignSelf: 'center',
        color: 'darkred',
    },
    successMsg: {
        marginVertical: '5%',
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'center',
        color: 'green',
    },
  });