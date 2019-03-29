import React from 'react';
import {
  Animated,
  StyleSheet, 
  Text, 
  View
} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
} from 'react-native-gesture-handler';

const USE_NATIVE_DRIVER = true;

export default class MovableObject extends React.Component {
    panRef = React.createRef();
    rotationRef = React.createRef();
    pinchRef = React.createRef();
    constructor(props) {
      super(props);
  
      /* Pinching */
      this._baseScale = new Animated.Value(1);
      this._pinchScale = new Animated.Value(1);
  
      this._scale = Animated.multiply(this._baseScale, this._pinchScale);
      this._lastScale = 1;
      this._onPinchGestureEvent = Animated.event(
        [{ nativeEvent: { scale: this._pinchScale } }],
        { useNativeDriver: USE_NATIVE_DRIVER }
      );
  
      /* Rotation */
      this._rotate = new Animated.Value(0);
      this._rotateStr = this._rotate.interpolate({
        inputRange: [-100, 100],
        outputRange: ['-100rad', '100rad'],
      });
      this._lastRotate = 0;
      this._onRotateGestureEvent = Animated.event(
        [{ nativeEvent: { rotation: this._rotate } }],
        { useNativeDriver: USE_NATIVE_DRIVER }
      );

      /* Move */
      this._translateX = new Animated.Value(0);
      this._translateY = new Animated.Value(0);
      this._lastOffset = { x: 0, y: 0 };
      this._onGestureEvent = Animated.event(
      [
          {
          nativeEvent: {
              translationX: this._translateX,
              translationY: this._translateY,
          },
          },
      ],
      { useNativeDriver: USE_NATIVE_DRIVER }
      );
    }
  
    _onRotateHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this._lastRotate += event.nativeEvent.rotation;
        this._rotate.setOffset(this._lastRotate);
        this._rotate.setValue(0);
      }
    };
    _onPinchHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this._lastScale *= event.nativeEvent.scale;
        this._baseScale.setValue(this._lastScale);
        this._pinchScale.setValue(1);
      }
    };
    _onMoveGestureStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this._lastOffset.x += event.nativeEvent.translationX;
        this._lastOffset.y += event.nativeEvent.translationY;
        this._translateX.setOffset(this._lastOffset.x);
        this._translateX.setValue(0);
        this._translateY.setOffset(this._lastOffset.y);
        this._translateY.setValue(0);
      }
    };
    render() {
      return (
        <PanGestureHandler
        ref={this.panRef}
        onGestureEvent={this._onGestureEvent}
        onHandlerStateChange={this._onHandlerStateChange}
        minDist={10}
        maxPointers={2}
        avgTouches>
        <Animated.View style={styles.wrapper}>
            <RotationGestureHandler
            ref={this.rotationRef}
            simultaneousHandlers={this.pinchRef}
            onGestureEvent={this._onRotateGestureEvent}
            onHandlerStateChange={this._onRotateHandlerStateChange}>
            <Animated.View style={styles.wrapper}>
                <PinchGestureHandler
                ref={this.pinchRef}
                simultaneousHandlers={this.rotationRef}
                onGestureEvent={this._onPinchGestureEvent}
                onHandlerStateChange={this._onPinchHandlerStateChange}>
                <Animated.View style={styles.container} collapsable={false}>
                    <Animated.Image
                    style={[
                        styles.pinchableImage,
                        {
                        transform: [
                            { perspective: 200 },
                            { scale: this._scale },
                            { rotate: this._rotateStr },
                            { translateX: this._translateX },
                            { translateY: this._translateY },
                        ],
                        },
                    ]}
                    source={{uri: "file:///Users/Jack/Desktop/videoApp/assets/mountains.jpg"}}
                    />
                </Animated.View>
                </PinchGestureHandler>
            </Animated.View>
            </RotationGestureHandler>
        </Animated.View>
        </PanGestureHandler>
      );
    }
  }


const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black',
      overflow: 'hidden',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'center',
    },
    pinchableImage: {
      width: 250,
      height: 250,
    },
    wrapper: {
      flex: 1,
    },
  });
  