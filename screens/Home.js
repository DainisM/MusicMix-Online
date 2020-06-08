import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import HomeStack from '../components/routes/homeStack';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <View style={styles.container}>
                
                <HomeStack />

                <View style={styles.homeNavigationContainer}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Browse')}  style={[styles.homeNavigationIcons]}>
                        <Icon
                            name='home' 
                            backgroundColor={'inherit'} 
                            color={'darkcyan'} 
                            size={40}
                            style={{padding: 5}}
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Search')}  style={styles.homeNavigationIcons}>
                        <Icon
                            name='search' 
                            backgroundColor={'inherit'} 
                            color={'darkcyan'} 
                            size={40}
                            style={{padding: 5}}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Library')} style={styles.homeNavigationIcons}>
                        <Icon                            
                            name='list' 
                            backgroundColor={'inherit'} 
                            color={'darkcyan'} 
                            size={40}
                            style={{padding: 5}}
                        />
                    </TouchableOpacity>
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
    homeNavigationContainer: {
        height: '10%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: '10%',
        paddingVertical: '3%',
        borderTopWidth: 3,
        borderTopColor: 'darkcyan',
    },
    homeNavigationIcons: {
        width: 60, 
        borderBottomColor: 'cyan', 
        alignSelf: 'center',
        alignItems: 'center',
    }
});