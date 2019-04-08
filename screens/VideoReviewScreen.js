import React, {Component} from 'react';
import {
  Animated,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image, 
  Text, 
  View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {connect} from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video'
import Modal from 'react-native-modal';

import {FRONT_SERVICE_URL} from '../Constants';

class VideoReviewScreen extends React.Component {
  state = {
    processing: false,
    success: false,
    animationFinished: false,
    error: "",
  }
  submitButtonWidth = new Animated.Value(1);

  toggleSubmitButton = () => {
    Animated.timing(this.submitButtonWidth, {
        toValue: this.submitButtonWidth._value === 1 ? 0 : 1,
        duration: 400
    }).start();
  };
  submitVideo = async () => {
    this.toggleSubmitButton();
    this.setState({processing: true})
    let uploadUri = ""
    await fetch(FRONT_SERVICE_URL + '/service/uploadItem', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.userToken,
        },
        body: JSON.stringify({
          latitude: "51.923147",
          longitude: "-0.226299",
          mediaType: "video",
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('error')) {
          this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
          console.error(responseJson.error);
        } else {
          uploadUri = responseJson.uploadUrl;
        }
      })
      .catch((error) => {
        this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
        console.log(error);
      });
      file = {uri: this.props.navigation.state.params.videoUri, type: "video/mp4", name: "string"};
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        // handle notifications about upload progress: e.loaded / e.total
        console.log('progress');
        console.log(e);
        
      }, false);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Successfully uploaded the file.
            console.log('successfully uploaded presignedurl');
            console.log(xhr);
            this.setState({processing: false, success: true})
            
          } else {
            // The file could not be uploaded.
            console.log('failed to upload presignedurl');
            console.log(xhr);
            
          }
        }
      };
      xhr.open('PUT', uploadUri);
      // for text file: text/plain, for binary file: application/octet-stream
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
  }
  
  render() {
    if (this.state.animationFinished) {
      let resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'CameraVideo' })
        ],
      });
      this.props.navigation.dispatch(resetAction);
      this.props.navigation.navigate('Feed');
    }
    let button = (
        <TouchableOpacity onPress={this.submitVideo}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
    );
    if (this.state.processing) {
      button = (
        <LottieView
          ref={animation => {
            if (animation) {
              animation.play(0, 44);
            }
          }}
          source={require('../assets/loading.json')}
        />
      );
    }
    if (this.state.success) {
      button = (
        <LottieView
          ref={animation => {
            if (animation) {
              this.animation = animation;
              animation.play(44, 95);
            }
          }}
          onAnimationFinish={() => {
            this.setState({animationFinished: true})
          }}
          loop={false}
          source={require('../assets/loading.json')}
        />
      );
    }
    const buttonWidth = this.submitButtonWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [60, Dimensions.get('window').width*0.7]
    });
    return (
      <View style={styles.container}>
        <View style={[styles.iconContainer, {top: 40, left: 20}]}>
            <TouchableOpacity style={styles.icon} onPress={() => { this.props.navigation.goBack() }}>
            <Icon name="close" size={40} color="white"/>
            </TouchableOpacity>
        </View>
        <Video
          source={{uri: this.props.navigation.state.params.videoUri}}
          style={{ 
            marginTop: 100,
            width: Dimensions.get('window').width, 
            height: Dimensions.get('window').width*8/7,
          }}
          muted={false}
          paused={false}
          repeat={true}
          resizeMode={"contain"}
          volume={1.0}
          rate={1.0} 
          ignoreSilentSwitch={"obey"}

        />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Animated.View style={[styles.submitButton,{width: buttonWidth}]} >
            {button}
          </Animated.View>
        </View>
          <Modal
              isVisible={this.state.error != ""}
              onBackdropPress={() => this.setState({ error: "" })}>
              <View style={{alignSelf: 'center',
                  justifySelf: 'center',
                  width: Dimensions.get('window').width*0.6,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  shadowRadius: 4,
                  shadowColor: 'grey',
                  shadowOffset: {height: 2, width: 0},
                  shadowOpacity: 0.25,
                  overflow: 'hidden',
                  padding: 15,
              }}>
              <Text style={{fontFamily: 'Avenir'}}>{this.state.error}</Text>
              </View>
          </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: '#D7E7ED',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute'
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 30,
    height: 60,
  },
  buttonText: {
      fontFamily: 'Avenir',
      color: 'white',
      fontSize: 20,
      padding: 13,
      textAlign: 'center',
  },
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(VideoReviewScreen);