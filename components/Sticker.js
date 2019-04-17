import React from 'react';
import {
  Animated,
  StyleSheet, 
  TouchableWithoutFeedback,
  Keyboard,
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

export default class Sticker extends React.Component {
    panRef = React.createRef();
    rotationRef = React.createRef();
    pinchRef = React.createRef();
    constructor(props) {
      super(props);
      this.active = false;
  
      /* Pinching */
      this._baseScale = new Animated.Value(1);
      this._pinchScale = new Animated.Value(1);

      this._scaleRaw = Animated.multiply(this._baseScale, this._pinchScale);
      this.minScale = 0.7;
      let inputRangeScale = [], outputRangeScale = [];
      for (var i = 0; i < 100; i++) {
        let num = i/10
        inputRangeScale.push(num);
        if (num < this.minScale) {
          outputRangeScale.push(this.minScale);
        } else {
          outputRangeScale.push(num);
        }
      }
      this._scale = this._scaleRaw.interpolate({
        inputRange: inputRangeScale,
        outputRange: outputRangeScale,
      });
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
      this._translateXOffset = new Animated.Value(0);
      this._translateYOffset = new Animated.Value(0);
      this._translateXValue = new Animated.Value(0);
      this._translateYValue = new Animated.Value(0);
      this._lastOffset = { x: 0, y: 0 };
      this._panning = new Animated.Value(0);
      this._onPanGestureEvent = Animated.event(
      [
          {
          nativeEvent: {
            translationX: this._translateXValue,
            translationY: this._translateYValue,
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
      this.props.passInfo(this._lastScale, this._lastRotate, this._lastOffset.x, this._lastOffset.y, this.props.id);
    };
    _onPinchHandlerStateChange = event => {
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this._lastScale *= event.nativeEvent.scale;
        if (this._lastScale < this.minScale) {
          this._lastScale = this.minScale;
        }
        console.log(this._scaleRaw._value + " " + this._scale._value + " " + this._lastScale)
        this._baseScale.setValue(this._lastScale);
        this._pinchScale.setValue(1);
      }
      this.props.passInfo(this._lastScale, this._lastRotate, this._lastOffset.x, this._lastOffset.y, this.props.id);
    };
    _onMoveGestureStateChange = event => {
      if (event.nativeEvent.state === State.ACTIVE) {
        this.active = true;
      } else {
        this.active = false;
      }
      if (event.nativeEvent.oldState === State.ACTIVE) {
        this._panning.setValue(0)
        this._lastOffset.x += (event.nativeEvent.translationX*Math.cos(this._lastRotate)-event.nativeEvent.translationY*Math.sin(this._lastRotate))*this._lastScale
        this._lastOffset.y += (event.nativeEvent.translationY*Math.cos(this._lastRotate)+event.nativeEvent.translationX*Math.sin(this._lastRotate))*this._lastScale
        this._translateXOffset.setValue(this._lastOffset.x);
        this._translateXValue.setValue(0);
        this._translateYOffset.setValue(this._lastOffset.y);
        this._translateYValue.setValue(0);
      } else {
        this._panning.setValue(1)
      }
      this.props.passInfo(this._lastScale, this._lastRotate, this._lastOffset.x, this._lastOffset.y, this.props.id);
    };
    _onSingleTap = event => {
        this.props.passInfo(this._lastScale, this._lastRotate, this._lastOffset.x, this._lastOffset.y, this.props.id);
    }
    render() {
      const cos = Animated.add(Animated.multiply(Animated.subtract(this._rotateCos, 1), this._panning), 1);
      const sin = Animated.add(Animated.multiply(Animated.subtract(this._rotateSin, 1), this._panning), 1);
      const scaleTranslate = Animated.add(Animated.multiply(Animated.subtract(this._scale, 1), this._panning), 1);
      const translateX = Animated.add(Animated.multiply(Animated.subtract(Animated.multiply(this._translateXValue, cos), Animated.multiply(this._translateYValue, sin)), scaleTranslate), this._translateXOffset);
      const translateY = Animated.add(Animated.multiply(Animated.add(Animated.multiply(this._translateYValue, cos), Animated.multiply(this._translateXValue, sin)), scaleTranslate), this._translateYOffset);
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
              style={[panStyle, styles.stickerContainer, {zIndex: this.props.zIndex, width: this.active ? 2000 : 250, height: this.active ? 2000 : 250}]}
              collapsable={false}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                  resizeMode={'contain'}
                />
              </TouchableWithoutFeedback>
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
  