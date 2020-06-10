import React, {Component} from 'react';
import { Dimensions, View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import ImagePicker from 'react-native-image-picker';

var deviceWidth = Dimensions.get('window').width;
var deviceHeigh = Dimensions.get('window').height;

export default class CreatePlaylist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlistName: '',
            playlistDescription: '',
            playlistImage: null,
            playlistNameError: '',
            playlistDescriptionError: '',
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

            console.log('response', JSON.stringify(res.path));
            this.setState({
              playlistImage: res.path,
            });
        });
      }

    async createNewPlaylist() {

        const isValid = this.validate();

        if(isValid) {
            console.log('Name: ' +this.state.playlistName);
            console.log('Description: ' +this.state.playlistDescription);
            console.log('Image: '+this.state.playlistImage);

            this.setState({
                playlistName: '',
                playlistDescription: '',
                playlistImage: null,
                playlistNameError: '',
                playlistDescriptionError: '',
            })
    
            this.props.closeModal();
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
    imagePath: {

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
  });