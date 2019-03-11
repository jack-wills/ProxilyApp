import React from 'react';
import {Animated, TouchableHighlight, View, Text} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

const SIZE = 70;

export default class AddButton extends React.Component {
    mode = new Animated.Value(0);

    toggleView = () => {
        Animated.timing(this.mode, {
            toValue: this.mode._value === 0 ? 2 : 0,
            duration: 400
        }).start();
    };
    render() {
        var range = 1, snapshot = 50, radius = 70;
        /// translateX
        var inputRange = [0, 1], outputRange1 = [SIZE/4, SIZE/4], outputRange2 = [SIZE/4, SIZE/4];
        for (var i=1; i<=snapshot; ++i) {
            var value = i/snapshot;
            var move = Math.sin(value * Math.PI * 2) * radius;
            inputRange.push((value*7)+1);
            outputRange1.push(-1*(move)+SIZE/4);
            outputRange2.push((move)+SIZE/4);
        }
        const firstX = this.mode.interpolate({
            inputRange: inputRange,
            outputRange: outputRange1
        });
        const secondX = this.mode.interpolate({
            inputRange: [0, 2],
            outputRange: [SIZE/4, SIZE/4]
        });
        const thirdX = this.mode.interpolate({
            inputRange: inputRange,
            outputRange: outputRange2
        });

        /// translateY
        var inputRange = [0, 1], outputRange = [0, -0.85*radius];
        for (var i=1; i<=snapshot; ++i) {
            var value = i/snapshot;
            var move = -Math.cos(value * Math.PI * 2) * radius;
            inputRange.push((value*7)+1);
            outputRange.push(move+SIZE/4);
        }
        const firstY = this.mode.interpolate({
            inputRange: inputRange,
            outputRange: outputRange
        });
        const secondY = this.mode.interpolate({
            inputRange: [0, 1, 2],
            outputRange: [0, -0.85*radius, -0.85*radius]
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
            <View>
                <Animated.View style={{
                    position: 'absolute',
                    zIndex: 1,
                    left: firstX,
                    top: firstY,
                    opacity
                }}>
                    <TouchableHighlight
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
                            backgroundColor: '#e74c3c'
                        }}
                    >
                        <Icon name="md-videocam" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    zIndex: 2,
                    left: secondX,
                    top: secondY,
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                            this.props.navigation.navigate('CameraPicture');
                            this.toggleView();
                        }}
                        style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            zIndex: 2,
                            backgroundColor: '#e74c3c'
                        }}
                    >
                        <Icon name="md-camera" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View>
                <Animated.View style={{
                    position: 'absolute',
                    zIndex: 1,
                    left: thirdX,
                    top: thirdY,
                    opacity
                }}>
                    <TouchableHighlight
                        onPress={() => {
                            this.props.navigation.navigate('SubmitText');
                            this.toggleView();
                        }}
                        style={{
                            position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: SIZE / 2,
                            height: SIZE / 2,
                            borderRadius: SIZE / 4,
                            zIndex: 2,
                            backgroundColor: '#e74c3c'
                        }}
                    >
                        <Icon name="md-create" size={16} color="#F8F8F8"/>
                    </TouchableHighlight>
                </Animated.View>
                <TouchableHighlight
                    onPress={this.toggleView}
                    underlayColor="#c0392b"
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 3,
                        width: SIZE,
                        height: SIZE,
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
                        ]
                    }}>
                        <Icon name="md-add" size={35} color="#F8F8F8"/>
                    </Animated.View>
                </TouchableHighlight>
            </View>
        );
    }
}