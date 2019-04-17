import React, {Component} from 'react';
import {
  Animated,
  TouchableWithoutFeedback,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StyleSheet, 
  Text, 
  ImageEditor,
  Image,
  View} from 'react-native';
  import { RNCamera } from 'react-native-camera';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
  import LottieView from 'lottie-react-native';
  import { RNFFmpeg } from 'react-native-ffmpeg';
  import FileSystem from 'react-native-fs';
  import {connect} from 'react-redux';

class CameraPictureScreen extends React.Component {
  state = {
    frontCamera: false,
    flash: RNCamera.Constants.FlashMode.off,
    autoFocusPoint: {
      normalized: { x: 0.5, y: 0.5 }, // normalized values required for autoFocusPointOfInterest
      drawRectPosition: {
        x: Dimensions.get('window').width * 0.5 - 32,
        y: Dimensions.get('window').height * 0.5 - 32,
      },
    },
  }
  focusPointOpacity = new Animated.Value(0);

  toggleFocusPoint = () => {
    Animated.timing(this.focusPointOpacity, {
      toValue: this.focusPointOpacity._value === 1 ? 0 : 1,
      duration: 750
    }).start();
};
  touchToFocus(event) {
    const { pageX, pageY } = event.nativeEvent;
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;
    const isPortrait = screenHeight > screenWidth;

    let x = pageX / screenWidth;
    let y = pageY / screenHeight;
    // Coordinate transform for portrait. See autoFocusPointOfInterest in docs for more info
    if (isPortrait) {
      x = pageY / screenHeight;
      y = -(pageX / screenWidth) + 1;
    }
    this.toggleFocusPoint();
    this.setState({
      autoFocusPoint: {
        normalized: { x, y },
        drawRectPosition: { x: pageX, y: pageY },
      },
    });
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener('willFocus', () =>
      this.setState({ focusedScreen: true })
    );
    navigation.addListener('willBlur', () =>
      this.setState({ focusedScreen: false })
    );
  }

  render() {
    if (!this.state.focusedScreen) return null;

    const drawFocusRingPosition = {
      top: this.state.autoFocusPoint.drawRectPosition.y - 32,
      left: this.state.autoFocusPoint.drawRectPosition.x - 32,
    };
    const focusPointOpacity = this.focusPointOpacity.interpolate({
        inputRange: [0, 0.35, 0.65, 1],
        outputRange: [0, 0.7, 0.7, 0]
    });
    return (
      <View style={styles.container}>
        <RNCamera
          ref={cam => {
            this.camera = cam;
          }}
          style={styles.preview}
          type={this.state.frontCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
          flashMode={this.state.flash}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera.'}
          autoFocusPointOfInterest={this.state.autoFocusPoint.normalized}
          >
          <View style={{height: Dimensions.get('window').width*8/7, width: Dimensions.get('window').width, paddingTop: 100}}>
            <Animated.View style={[styles.autoFocusBox, drawFocusRingPosition, {opacity: focusPointOpacity}]} />
            <TouchableWithoutFeedback onPress={this.touchToFocus.bind(this)}>
              <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width*8/7}} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.blackoutTop}>
          <SafeAreaView style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', width: Dimensions.get('window').width/2, paddingLeft: 20}}>
              <TouchableOpacity style={styles.icon} onPress={() => { this.props.navigation.navigate('Feed') }}>
                <Icon name="arrow-left" size={40} color="white"/>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', width: Dimensions.get('window').width/2, paddingRight: 20}}>
              <TouchableOpacity style={styles.icon} onPress={this.switchCamera}>
                <View style={{width: 50, height: 50, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', marginBottom: 6, marginRight: 5}}>
                  <LottieView
                    style={{height: 200}}
                    ref={animation => {
                      this.animation = animation;
                      if (this.animation) {
                        if (this.state.frontCamera) {
                          this.animation.play(130, 130);
                        } else {
                          this.animation.play(60, 60);
                        }
                      }
                    }}
                    loop={false}
                    source={require('../assets/switchCamera.json')}
                    resizeMode='cover'
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.icon} onPress={this.switchFlash}>
                <Icon name={this.getFlashIcon()} size={40} color="white"/>
              </TouchableOpacity>
            </View>
            </SafeAreaView>
          </View>
          <View style={styles.blackoutBottom}>
            <TouchableOpacity style={styles.icon} onPress={this.takePicture}>
              <Image source={require('../assets/camera.png')} style={{
              width: 90,
              height: 90}} 
              resizeMode="contain"/>
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    );
  }
  getFlashIcon() {
      if (this.state.flash == RNCamera.Constants.FlashMode.off) {
        return "flash-off";
      } else if (this.state.flash == RNCamera.Constants.FlashMode.auto) {
        return "flash-auto";
      } else {
        return "flash";
      }
  }
  
  takePicture = async () => {
    const options = {
      quality: 0.8,
      forceUpOrientation: true,
      fixOrientation: true,
    };
    try {
      this.setState({ processing: true });
      let data;
      if (__DEV__) {
        data = {uri:'file:///Users/Jack/Desktop/videoApp/assets/mountains.jpg', height: 2592, width: 4608}
      } else {
        data = await this.camera.takePictureAsync(options);
      }
      const actualImageWidth = data.height*Dimensions.get('window').width/Dimensions.get('window').height;
      const cropOptions = {
        cropOffsetX: Math.round((data.width-actualImageWidth)/2), 
        cropOffsetY: Math.round(100*actualImageWidth/Dimensions.get('window').width),
        cropWidth: Math.round(actualImageWidth),
        cropHeight: Math.round(actualImageWidth*8/7),
      }
      FileSystem.mkdir(FileSystem.DocumentDirectoryPath + "/proxily/tmp")
      const timestamp = new Date().getTime();
      const file_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/image_" + timestamp + ".png";
      let flip = this.state.frontCamera ? "hflip[flipped];[flipped]" : "";
      await RNFFmpeg.executeWithArguments(["-i", data.uri, "-b:v", "2M", "-filter:v", flip + "crop=" + cropOptions.cropWidth + ":" + cropOptions.cropHeight + ":" + cropOptions.cropOffsetX + ":" + cropOptions.cropOffsetY, "-c:a", "copy", file_path])
      .then((result) => {
        console.log('Path to image: ' + file_path);
        this.setState({ processing: false });
        this.props.navigation.navigate("PictureReview", {imageUri: file_path, imageWidth: actualImageWidth})
      }).catch((error) => {
        console.log("Video couldn't be cropped: " + error);
        this.setState({ processing: false });
      });
      
    } catch (err) {
      console.log('err: ', err);
    }
  };
  switchCamera = async () => {
    if (this.state.frontCamera) {
      this.animation.play(130, 145);
    } else {
      this.animation.play(60, 70);
    }
    this.setState({frontCamera: !this.state.frontCamera})
  };
  switchFlash = async () => {
    if (this.state.flash == RNCamera.Constants.FlashMode.off) {
      this.setState({flash: RNCamera.Constants.FlashMode.auto})
    } else if (this.state.flash == RNCamera.Constants.FlashMode.auto) {
      this.setState({flash: RNCamera.Constants.FlashMode.on})
    } else {
      this.setState({flash: RNCamera.Constants.FlashMode.off})
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    overflow: 'hidden',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    alignItems: 'center'
  },
  iconContainer: {
    position: 'absolute'
  },
  blackoutTop: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(20,20,20,0.7)',
    width: Dimensions.get('window').width,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  autoFocusBox: {
    position: 'absolute',
    height: 64,
    width: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: 'white',
    shadowRadius: 32,
    shadowColor: 'grey',
    shadowOffset: {height: 0, width: 0},
    shadowOpacity: 1,
  },
  blackoutBottom: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(20,20,20,0.7)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height-100-(Dimensions.get('window').width)*8/7,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(CameraPictureScreen);