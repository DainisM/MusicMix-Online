import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView, Linking,  } from 'react-native';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ShowArtistInfo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Modal
            style={styles.playlistModal}
            animationType='slide'
            visible={this.props.infoOpen}
            transparent={true}
            swipeDirection='down'
            swipeTreshold={90}
            onSwipeComplete={() => this.props.closeInfo()}
            >
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

                        <View style={styles.infoBox}>
                            <Text><Text style={{fontWeight: 'bold'}}>Type: </Text>{this.props.artistType}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Carrier start: </Text>{this.props.artistCarrier}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Location: </Text>{this.props.artistLocation}</Text>
                            <Text><Text style={{fontWeight: 'bold'}}>Active: </Text>{this.props.artistActive}</Text>
                            <Text style={{fontWeight: 'bold'}}>More info - <Text style={{fontWeight: 'normal', color: 'blue', textDecorationLine: 'underline'}} onPress={() => Linking.openURL(this.props.artistLink)}>{this.props.artistLink}</Text></Text>
                        </View>

                        <ScrollView>
                            <Text>{this.props.artistDescription}</Text>
                        </ScrollView>        

                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    modalBackContainer: {
        backgroundColor: '#000000aa',
        flex: 1, 
    },
    modalContainer: {
        alignSelf: 'center',
        marginVertical: '5%',
        backgroundColor: 'lightblue' ,
        width: '90%',
        padding: 20, 
        borderRadius: 10,
        flex: 1, 
    },
    infoBox: {
        marginBottom: '5%',
        borderWidth: 1,
        padding: '5%',
    },
  });