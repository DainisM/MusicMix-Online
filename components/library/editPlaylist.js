import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TextInput, Keyboard } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import FormData from 'form-data';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;
let postData = new FormData();

export default class EditPlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlistDeletedMsg: false,
            playlistName: '',
            playlistDescription: '',
            playlistImage: '',
            playlistImagePath: '',
            playlistNameError: '',
            playlistDescriptionError: '',
            successMsg: false,
        }
    }

    async deletePlaylist() {
        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');
        //Variable that holds user id found in storage
        var userID = await AsyncStorage.getItem('ID');
        var url = "http://api.music-mix.live/playlists/" +this.props.playlistID+"/users/"+userID+"";

        //Delete user playlist
        axios
        .delete(url, 
            {
            data : { track_id: this.props.songID },
            headers: { Authorization: 'Bearer '+token }})
        .then(response => {
            //If response ok then do following
            if (response.status === 200) {
                this.setState({playlistDeletedMsg: true});

                setTimeout(() => {
                    this.setState({playlistDeletedMsg: false})
                    this.props.backToLibrary();
                }, 1000)

            }
        })
        //else log error
        .catch(error => {
            console.log("error " + error);
        });
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
            this.setState({
                playlistImagePath: 'file://'+res.path,
                playlistImage: res,
            });
        });
    }

    editUserPlaylist = async () => {

        const isValid = this.validate();

        //Variable that holds JWT token found in storage
        var token = await AsyncStorage.getItem('Token');
        //Variable that holds user id found in storage
        var userID = await AsyncStorage.getItem('ID');
        var url = "http://api.music-mix.live/playlists/"+this.props.playlistID+"/users/"+userID;

        const createFormData = (image, body) => {
            const data = new FormData();
          
            data.append("image", {
              name: image.fileName,
              type: image.type,
              uri:
                Platform.OS === "android" ? image.uri : image.uri.replace("file://", "")
            });
          
            Object.keys(body).forEach(key => {
              data.append(key, body[key]);
            });
          
            return data;
        };

        postData.append('name', this.state.playlistName);
        postData.append('description', this.state.playlistDescription)
        postData.append('image', {uri: 'file:/'+this.state.playlistImage.path, type: this.state.playlistImage.type, name: this.state.playlistImage.fileName});

        if(isValid) {

            fetch(url, {
                method: 'PATCH',
                headers: {
                    Authorization: "Bearer " + token
                },
                body: createFormData(this.state.playlistImage, {name: this.state.playlistName, description: this.state.playlistDescription})
            })
            .then(response => {
                console.log(response);
                //If response ok then do following
                if (response.status === 200) {
                    this.setState({successMsg: true});

                    setTimeout(() => {
                        this.setState({successMsg: false})
                    }, 1000)

                }
            })
            //else log error
            .catch(error => {
                console.log(error);
            }); 

            // //Update user playlist
            // await axios
            // .patch(url, 
            //     { 
            //         postData
            //     },  
            //     { headers: { Authorization: 'Bearer '+token }, },)
            // .then(response => {
            //     console.log(response);
            //     //If response ok then do following
            //     if (response.status === 200) {
            //         this.setState({successMsg: true});

            //         setTimeout(() => {
            //             this.setState({successMsg: false})
            //         }, 1000)

            //     }
            // })
            // //else log error
            // .catch(error => {
            //     console.log("error " + error);
            // });            
        }
    }


    render() {
        return (
            <Modal
            style={styles.playlistModal}
            animationType='slide'
            visible={this.props.isVisible}
            transparent={true}
            swipeDirection='down'
            swipeTreshold={90}
            onSwipeComplete={() => this.props.closeEditPlaylist()}
            >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                <View style={styles.modalBackContainer}>

                <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 5,}}>
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />

                        <Text style={{color: 'darkcyan', marginHorizontal: '3%'}}>Swipe down to close</Text>

                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                        <Icon style={{textAlignVertical: 'center'}} name='angle-down' size={16} color={'darkcyan'} />
                    </View>

                    <View style={styles.modalContainer}>

                        <View style={styles.editPlaylistContainer}>

                            <Text style={styles.headers}>Edit playlist</Text>

                            <View style={styles.playlistRow}>
                                <Text style={styles.playlistLabel}>Playlist new name:</Text>
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
                                    <Text style={styles.playlistLabel}>Playlist new description:</Text>
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
                                    <Text style={styles.playlistLabel}>Choose a new image:</Text>

                                    <View style={styles.chooseImage}>
                                        <TouchableOpacity style={styles.buttonImage} onPress={this.mageGalleryLaunch}>
                                        <   Text style={styles.buttonText}>Browse</Text>
                                        </TouchableOpacity>

                                        <Text style={styles.imagePath}>{this.state.playlistImagePath}</Text>
                                    </View>
                                    
                                    {!this.state.playlistDescriptionError == '' ? (
                                        <Text style={styles.errorText}>{this.state.playlistDescriptionError}</Text>
                                    ) : null}
                                </View>

                                <View style={styles.butonContainer}>
                                    <TouchableOpacity style={styles.buttonCreate} onPress={() => this.editUserPlaylist()}>
                                        <Text style={styles.buttonText}>Update</Text>
                                    </TouchableOpacity>
                                </View>

                                {this.state.successMsg ? (
                                    <Text style={styles.successMsg}>Playlist updated successfully!</Text>
                                ) : (null)}

                            </View>

                        <View style={styles.removePlaylistContainer}>
                            
                            <Text style={styles.headers}>Delete playlist</Text>
                            
                            <View style={styles.butonContainer}>
                                <TouchableOpacity style={styles.buttonDelete} onPress={() => this.deletePlaylist()}>
                                    <Text style={styles.buttonText}>Delete playlist</Text>
                                </TouchableOpacity>
                            </View>

                            {this.state.playlistDeletedMsg ? (
                                <Text style={styles.successMsg}>Playlist successfully deleted!</Text>
                            ) : (<Text style={styles.successMsg}></Text>)}
                        </View>

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
        marginVertical: '5%',
        backgroundColor: 'lightblue' ,
        width: '70%',
        height: deviceHeigh / 1.3,
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
        marginVertical: '2%',
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
        justifyContent: 'center',
        marginTop: '7%',
    },
    chooseImage: {
        flexDirection: 'row',
    },
    buttonImage: {
        width: 80,
        padding: 10,
        backgroundColor: '#698a85',
        borderRadius: 10,
    },
    buttonCreate: {
        alignItems: 'center',
        width: 100,
        padding: 10,
        backgroundColor: '#28ad66',
        borderRadius: 10,
        marginBottom: '3%',
    },
    buttonDelete: {
        alignItems: 'center',
        width: 130,
        padding: 10,
        backgroundColor: '#698a85',
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
    imagePath: {
        marginHorizontal: '3%',
    },
    successMsg: {
        marginVertical: '3%',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'darkcyan',
        alignSelf: 'center',
    },
    headers: {
        fontStyle: 'italic',
        fontSize: 18,
        marginVertical: '5%',
    },
    links: {
        marginLeft: '5%',
    },
    editPlaylistContainer: {
        maxHeight: '90%',
        paddingBottom: '5%',
        borderBottomWidth: 2,
    },
    removePlaylistContainer: {
    },
  });