import React, {Component} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet, 
  Text, 
  View} from 'react-native';
  import { RNCamera } from 'react-native-camera';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
  import {connect} from 'react-redux';
  import { ProcessingManager } from 'react-native-video-processing';

class CameraVideoScreen extends React.Component {
  state = {
    frontCamera: false,
    flash: RNCamera.Constants.FlashMode.off,
    recording: false,
    processing: false
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

    let button = (
      <View style={[styles.iconContainer, {bottom: 40}]}>
        <TouchableOpacity style={styles.icon} onPress={this.record}>
          <Icon name="camera" size={40} color="white"/>
        </TouchableOpacity>
      </View>
    );

    if (this.state.recording) {
      button = (
        <View style={[styles.iconContainer, {bottom: 40}]}>
        <TouchableOpacity
          onPress={this.stopRecording.bind(this)}
          style={styles.icon}
        >
          <Text style={{ fontSize: 14 , backgroundColor: 'white'}}> STOP </Text>
        </TouchableOpacity>
      </View>
      );
    }

    if (this.state.processing) {
      button = (
        <View style={[styles.iconContainer, {bottom: 40}]}>
          <ActivityIndicator animating  size="large" />
        </View>
      );
    }
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
        >
          <View style={styles.blackoutTop}/>
          <View style={styles.blackoutBottom}/>
          {button}
          <View style={[styles.iconContainer, {top: 30, left: 30}]}>
            <TouchableOpacity style={styles.icon} onPress={() => { this.props.navigation.navigate('Feed') }}>
              <Icon name="arrow-left" size={40} color="white"/>
            </TouchableOpacity>
          </View>
          <View style={[styles.iconContainer, {top: 30, right: 70}]}>
            <TouchableOpacity style={styles.icon} onPress={this.switchCamera}>
              <Icon name="sync" size={40} color="white"/>
            </TouchableOpacity>
          </View>
          <View style={[styles.iconContainer, {top: 30, right: 30}]}>
            <TouchableOpacity style={styles.icon} onPress={this.switchFlash}>
              <Icon name={this.getFlashIcon()} size={40} color="white"/>
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    );
  }
  record = async () => {
    try {
      this.setState({ recording: true });
      console.log('recording');
      const options = { quality: RNCamera.Constants.VideoQuality["480p"], orientation: "landscapeRight"};
      const data = await this.camera.recordAsync(options);
      console.log('not recording');
      this.setState({ recording: false, processing: true });
      const cropOptions = {
        cropOffsetX: 100, 
        cropOffsetY: 0,
        cropWidth: 480, 
        cropHeight: 480,
      }
      console.log('Path to video: ' + data.uri);
      ProcessingManager.crop(data.uri, cropOptions).then((data) => {
        console.log('Path to video: ' + data);
        this.setState({ processing: false });
        this.props.navigation.navigate("VideoReview", {videoUri: data, fail: false})
      }).catch((err) => {
        console.log("Video couldn't be cropped: " + err);
        this.setState({ processing: false });
        this.props.navigation.navigate("VideoReview", {videoUri: data.uri, fail: true, error: err})
      });
    } catch (err) {
      // console.log('err: ', err);
    }
  };

  stopRecording() {
    this.camera.stopRecording();
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
  switchCamera = async () => {
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
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  icon: {
    flex: 0,
    alignSelf: 'center',
  },
  iconContainer: {
    position: 'absolute'
  },
  blackoutTop: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: Dimensions.get('window').width,
    height: 150
  },
  blackoutBottom: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height-150-(Dimensions.get('window').width)
  }
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(CameraVideoScreen);