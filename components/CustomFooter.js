
import React from "react";
import { Dimensions, View, SafeAreaView, StyleSheet, TouchableWithoutFeedback, TouchableHighlight } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

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
                height: 70,
                backgroundColor: '#B2DBBF',
                flexDirection: 'row',
            }}
            >
            <View
                style={styles.mediaButton}>
            <TouchableWithoutFeedback
                onPress={() => jumpTo(routes[0].key)}
                underlayColor={'#70C1B3'}>

            <AddMediaButton />

            </TouchableWithoutFeedback>
            </View>
            <View
            style={{
                height: 70,
                backgroundColor: '#B2DBBF',
                flexDirection: 'row',
                justifyContent: 'space-around',
            }}>
            <TouchableHighlight
                onPress={() => jumpTo(routes[0].key)}
                underlayColor={'#70C1B3'}
                style={[styles.tabButton, {paddingRight: 20}]}
            >
            <Icon name="md-home" color={index === 0 ? activeTintColor : inactiveTintColor} size={30} />
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => jumpTo(routes[1].key)}
                underlayColor={'#70C1B3'}
                style={[styles.tabButton, {paddingLeft: 20, borderLeftWidth: 1}]}
            >
            <Icon name="md-settings" color={index === 1 ? activeTintColor : inactiveTintColor} size={30} />
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
        height: 70,
        paddingBottom: 10,
    },
    mediaButton: {
        position: 'absolute',
        zIndex: 2,
        left: (Dimensions.get('window').width-70)*0.5,
        bottom: 20,
    }
});