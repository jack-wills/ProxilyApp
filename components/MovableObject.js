import React from 'react';
import {
  Animated,
  StyleSheet, 
  TouchableWithoutFeedback,
  Text, 
  View
} from 'react-native';

import {
  PanGestureHandler,
  PinchGestureHandler,
  RotationGestureHandler,
  State,
  TapGestureHandler
} from 'react-native-gesture-handler';

const USE_NATIVE_DRIVER = false;

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
      let inputRange = [], outputRange = [], steps = 500;
      /// input range 0-1
      for (let i=0; i<=steps; ++i) {
          let key = ((i*2/steps)-1)*100;
          inputRange.push(key);
          outputRange.push(Math.cos(key));
      }
      this._rotateCos = this._rotate.interpolate({
        inputRange: inputRange,
        outputRange: outputRange,
      });
      inputRange = [];
      outputRange = [];
      /// input range 0-1
      for (let i=0; i<=steps; ++i) {
          let key = ((i*2/steps)-1)*100;
          inputRange.push(key);
          outputRange.push(Math.sin(key));
      }
      this._rotateSin = this._rotate.interpolate({
        inputRange: inputRange,
        outputRange: outputRange,
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
      this._onPanGestureEvent = Animated.event(
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
      this.props.passInfo(this._scale._value, this._rotate._value, this._translateX._value, this._translateY._value, this.props.id);
    };
    _onPinchHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this._lastScale *= event.nativeEvent.scale;
        this._baseScale.setValue(this._lastScale);
        this._pinchScale.setValue(1);
      }
      this.props.passInfo(this._scale._value, this._rotate._value, this._translateX._value, this._translateY._value, this.props.id);
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
      this.props.passInfo(this._scale._value, this._rotate._value, this._translateX._value, this._translateY._value, this.props.id);
    };
    _onSingleTap = event => {
        this.props.passInfo(this._scale._value, this._rotate._value, this._translateX._value, this._translateY._value, this.props.id);
    }
    render() {
        const translateX = Animated.subtract(Animated.multiply(this._translateX, this._rotateCos), Animated.multiply(this._translateY, this._rotateSin));
        const translateY = Animated.add(Animated.multiply(this._translateY, this._rotateCos), Animated.multiply(this._translateX, this._rotateSin));
        const scale = this._scale;
        const rotate = this._rotateStr;
        const panStyle = {
          transform: [{ translateX }, { translateY }, { scale }, { rotate }],
        };
      return (
        <TapGestureHandler
          onHandlerStateChange={this._onSingleTap}>
        <PanGestureHandler
          {...this.props}
          onGestureEvent={this._onPanGestureEvent}
          onHandlerStateChange={this._onMoveGestureStateChange}
          id={"image_drag" + this.props.id}
          simultaneousHandlers={['image_pinch' + this.props.id, 'image_rotation' + this.props.id]}
          shouldCancelWhenOutside={true}
        >
          <RotationGestureHandler
            id={"image_rotation" + this.props.id}
            simultaneousHandlers={['image_pinch' + this.props.id, 'image_drag' + this.props.id]}
            onGestureEvent={this._onRotateGestureEvent}
            onHandlerStateChange={this._onRotateHandlerStateChange}
          >
            <PinchGestureHandler
              id={"image_pinch" + this.props.id}
              simultaneousHandlers={['image_rotation' + this.props.id, 'image_drag' + this.props.id]}
              onGestureEvent={this._onPinchGestureEvent}
              onHandlerStateChange={this._onPinchHandlerStateChange}
            >
              <Animated.View
                style={[panStyle, styles.stickerContainer, {zIndex: this.props.zIndex}]}
                collapsable={false}
              >
                <Animated.Image
                  style={[
                    styles.pinchableImage,
                    {
                      transform: [
                        { perspective: 200 },
                      ],
                    },
                  ]}
                  source={{
                    uri: this.props.source,
                  }}
                />
              </Animated.View>
            </PinchGestureHandler>
          </RotationGestureHandler>
        </PanGestureHandler>
        </TapGestureHandler>
      );
    }
  }
  
const styles = StyleSheet.create({
    stickerContainer: {
      position: 'absolute',
      width: 250,
      height: 250,
      alignItems: 'center',
      justifyContent: 'center',
    },
    pinchableImage: {
      width: 250,
      height: 250,
    },
  });
  