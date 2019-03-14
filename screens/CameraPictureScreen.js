import React, {Component} from 'react';
import {
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StyleSheet, 
  Text, 
  ImageEditor,
  View} from 'react-native';
  import { RNCamera } from 'react-native-camera';
  import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
  import {connect} from 'react-redux';

class CameraPictureScreen extends React.Component {
  state = {
    frontCamera: false,
    flash: RNCamera.Constants.FlashMode.off
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
          <View style={[styles.iconContainer, {bottom: 40}]}>
            <TouchableOpacity style={styles.icon} onPress={this.takePicture}>
              <Icon name="camera" size={40} color="white"/>
            </TouchableOpacity>
          </View>
          <View style={[styles.iconContainer, {top: 40, left: 20}]}>
            <TouchableOpacity style={styles.icon} onPress={() => { this.props.navigation.navigate('Feed') }}>
              <Icon name="arrow-left" size={40} color="white"/>
            </TouchableOpacity>
          </View>
          <View style={[styles.iconContainer, {top: 40, right: 90}]}>
            <TouchableOpacity style={styles.icon} onPress={this.switchCamera}>
              <Icon name="sync" size={40} color="white"/>
            </TouchableOpacity>
          </View>
          <View style={[styles.iconContainer, {top: 40, right: 30}]}>
            <TouchableOpacity style={styles.icon} onPress={this.switchFlash}>
              <Icon name={this.getFlashIcon()} size={40} color="white"/>
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
      fixOrientation: true
    };
    try {
      const data = await this.camera.takePictureAsync(options);
      const cropData = {
        offset: {x: 0, y: 150},
        size: {width: Dimensions.get('window').width, height: Dimensions.get('window').width},
      };
      ImageEditor.cropImage(data.uri, 
        cropData, (croppedUri) => {
          console.log('Path to image: ' + croppedUri);
          this.props.navigation.navigate("PictureReview", {imageUri: croppedUri})
        }, (error) =>{
          console.log('cropImage,',error);
        });
      
    } catch (err) {
      // console.log('err: ', err);
    }
  };
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

export default connect(mapStateToProps)(CameraPictureScreen);