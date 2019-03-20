
import React from "react";
import { Animated, Dimensions, View, SafeAreaView, StyleSheet, TouchableOpacity, TouchableHighlight } from "react-native";
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import IonIcon from 'react-native-vector-icons/Ionicons'
const SIZE = 60 + Dimensions.get('window').height*0.015;

export default class CustomFooter extends React.Component {
    mode = new Animated.Value(0);

    toggleView = () => {
        Animated.timing(this.mode, {
            toValue: this.mode._value === 0 ? 2 : 0,
            duration: 400
        }).start();
    };

    renderButton() {
        var range = 1, snapshot = 50, radius = 70;
        /// translateX
        const xOffset = 100-(SIZE/4);
        var inputRange = [0, 1], outputRange1 = [xOffset, xOffset], outputRange2 = [xOffset, xOffset];
        for (var i=1; i<=snapshot; ++i) {
            var value = i/snapshot;
            var move = Math.sin(value * Math.PI * 2) * radius;
            inputRange.push((value*7)+1);
            outputRange1.push(-1*(move)+xOffset);
            outputRange2.push((move)+xOffset);
        }
        const firstX = this.mode.interpolate({
            inputRange: inputRange,
            outputRange: outputRange1
        });
        const secondX = this.mode.interpolate({
            inputRange: [0, 2],
            outputRange: [xOffset, xOffset]
        });
        const thirdX = this.mode.interpolate({
            inputRange: inputRange,
            outputRange: outputRange2
        });

        /// translateY
        var inputRange = [0, 1], outputRange = [0, 0.85*radius+SIZE/2];
        for (var i=1; i<=snapshot; ++i) {
            var value = i/snapshot;
            var move = Math.cos(value * Math.PI * 2) * radius;
            inputRange.push((value*7)+1);
            outputRange.push((move+SIZE/4));
        }
        const firstY = this.mode.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        });
        const secondY = this.mode.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, 0.85*radius+SIZE/2, 0.85*radius+SIZE/2]
        });
        const thirdY = this.mode.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        });
        const opacity = this.mode.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        });
        const rotation = this.mode.interpolate({
            inputRange: [0, 2],
            outputRange: ['0deg', '45deg']
        });
        return (
            <View 
                style={{
                    height: 200,
                    width: 200,
                    justifyContent: 'flex-end',
                    alignItems: 'center'
                }}
                pointerEvents='box-none'
            >
                <Animated.View style={{
                    position: 'absolute',
                    zIndex: 10,
                    left: firstX,
                    bottom: firstY,
                    opacity
                }}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate('CameraVideo');
                            this.toggleView();
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            zIndex: 2,
                            backgroundColor: '#e74c3c',
                        }}
                    >
                        <IonIcon name="md-videocam" size={16} color="#F8F8F8"/>
                    </TouchableOpacity>
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    zIndex: 20,
                    left: secondX,
                    bottom: secondY,
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                            this.props.navigation.navigate('CameraPicture');
                            this.toggleView();
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            zIndex: 2,
                            backgroundColor: '#e74c3c'
                        }}
                    >
                        <IonIcon name="md-camera" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    zIndex: 10,
                    left: thirdX,
                    bottom: thirdY,
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                            this.props.navigation.navigate('SubmitText');
                            this.toggleView();
                        }}
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            zIndex: 20,
                            backgroundColor: '#e74c3c',
                        }}
                    >
                        <IonIcon name="md-create" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View>
                <TouchableHighlight
                    onPress={this.toggleView}
                    underlayColor="#c0392b"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 30,
                        width: SIZE,
                        height: SIZE,
                        margin: 0,
                        padding: 0,
                        borderWidth: 0,
                        borderRadius: SIZE / 2,
                        backgroundColor: '#e74c3c',
                        shadowRadius: 2,
                        shadowColor: 'grey',
                        shadowOffset: {height: -2, width: 0},
                        shadowOpacity: 0.5,
                    }}
                >
                <Animated.View style={{
                    transform: [
                        {rotate: rotation}
                    ],
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 31,
                    width: SIZE,
                    height: SIZE,
                    borderRadius: SIZE / 2,
                    shadowRadius: 2,
                    shadowColor: 'grey',
                    shadowOffset: {height: -2, width: 0},
                    shadowOpacity: 0.5,
                }}>
                        <IonIcon name="md-add" size={35} color="#F8F8F8"/>
                    </Animated.View>
                </TouchableHighlight>
            </View>
        );
    }
//<AddMediaButton style={styles.mediaButton} navigation={this.props.navigation}/>

    render() {
        const {
            navigation: {state: {index, routes}},
            style,
            activeTintColor,
            inactiveTintColor,
            renderIcon,
            jumpTo
        } = this.props;
        let height = Dimensions.get('window').height*0.08;
        if (height > 65) {
            height = 65;
        }
        return (
            <View>
            <View
            style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                justifyContent: 'flex-end',
                minHeight: 160,
            }}
            pointerEvents="box-none"
            forceInset={{
                top: 'never',
                bottom: 'always',
            }}/>
            
            <View style={styles.mediaButton} pointerEvents="box-none">
                {this.renderButton()}
            </View>
            <SafeAreaView
            style={{
                height: height,
                backgroundColor: '#E3e3e3',
                flexDirection: 'row',
                justifyContent: 'space-around',
                shadowRadius: 4,
                shadowColor: 'grey',
                shadowOffset: {height: -2, width: 0},
                shadowOpacity: 0.5

            }}>
            <View style={{
                height: height,
                flexDirection: 'row',}}>
            <TouchableHighlight
                onPress={() => {
                    if (this.mode._value === 2) {
                        this.toggleView();
                    }
                    jumpTo(routes[0].key);
                }}
                underlayColor={'#00b489'}
                style={[styles.tabButton, {
                    paddingRight: 20, 
                    borderBottomWidth: index === 0 ? 3 : 0}]}
            >
            <Icon name="home" color={index === 0 ? '#e74c3c' : '#555'} size={30} />
            </TouchableHighlight>
            <TouchableHighlight
                onPress={() => {
                    if (this.mode._value === 2) {
                        this.toggleView();
                    }
                    jumpTo(routes[1].key);
                }}
                underlayColor={'#00b489'}
                style={[styles.tabButton, {
                    paddingLeft: 20, 
                    borderLeftWidth: 1,
                    borderLeftColor: 'black', 
                    borderBottomWidth: index === 1 ? 3 : 0}]}
            >
            <Icon name="directions" color={index === 1 ? '#e74c3c' : '#555'} size={30} />
            </TouchableHighlight>
            </View>
            </SafeAreaView>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    tabButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width*0.5,
        borderBottomColor: '#e74c3c',
    },
    mediaButton: {
        position: 'absolute',
        zIndex: 2,
        left: (Dimensions.get('window').width-200)*0.5,
        bottom: Dimensions.get('window').height*0.025,
    }
});