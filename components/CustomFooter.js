
import React from "react";
import { Dimensions, View, SafeAreaView, StyleSheet, TouchableWithoutFeedback, TouchableHighlight } from "react-native";
import Icon from 'react-native-vector-icons/SimpleLineIcons'

import AddMediaButton from './AddMediaButton';

export default class CustomFooter extends React.Component {

    render() {
        const {
            navigation: {state: {index, routes}},
            style,
            activeTintColor,
            inactiveTintColor,
            renderIcon,
            jumpTo
        } = this.props;
        return (
            <SafeAreaView
            style={{
                height: 60,
                backgroundColor: '#02b875',
                flexDirection: 'row',
                shadowRadius: 4,
                shadowColor: 'grey',
                shadowOffset: {height: -2, width: 0},
                shadowOpacity: 0.5

            }}
            >
            <View
                style={styles.mediaButton}>
            <TouchableWithoutFeedback
                onPress={() => jumpTo(routes[0].key)}>

            <AddMediaButton navigation={this.props.navigation}/>

            </TouchableWithoutFeedback>
            </View>
            <View
            style={{
                height: 60,
                flexDirection: 'row',
                justifyContent: 'space-around',
            }}>
            <TouchableHighlight
                onPress={() => jumpTo(routes[0].key)}
                underlayColor={'#00b489'}
                style={[styles.tabButton, {
                    paddingRight: 20, 
                    backgroundColor: '#02b875',
                    borderBottomColor: '#e74c3c',
                    borderBottomWidth: index === 0 ? 3 : 0}]}
            >
            <Icon name="home" color={index === 0 ? '#e74c3c' : '#555'} size={30} />
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => jumpTo(routes[1].key)}
                underlayColor={'#00b489'}
                style={[styles.tabButton, {
                    paddingLeft: 20, 
                    borderLeftWidth: 1,
                    borderLeftColor: 'black', 
                    borderBottomColor: '#e74c3c',
                    borderBottomWidth: index === 1 ? 3 : 0,
                borderColor: '#e74c3c'}]}
            >
            <Icon name="directions" color={index === 1 ? '#e74c3c' : '#555'} size={30} />
            </TouchableHighlight>
            </View>
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width*0.5,
    },
    mediaButton: {
        position: 'absolute',
        zIndex: 2,
        left: (Dimensions.get('window').width-70)*0.5,
        bottom: 13,
    }
});