import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {updateVideoPlaying} from '../actions/UpdateVideo';

import VideoComponent from './VideoComponent';

class FeedMediaItem extends React.Component {

  _onPressVideo = () => {
    if (this.props.playing) {
      this.props.updateVideoPlaying("")
    } else {
      this.props.updateVideoPlaying(this.props.itemInfo.video.url)
    }
  };

  render(){
      if (this.props.itemInfo.hasOwnProperty('video')) {
          return(
            <View style={[styles.video, {overflow: 'hidden'}]}>
              <TouchableOpacity style={styles.video} onPress={this._onPressVideo}>
                  <VideoComponent 
                      style={styles.video} 
                      url={this.props.itemInfo.video.url}
                      navigation={this.props.navigation}
                  />
              </TouchableOpacity>
            </View>
          )
      }
      if (this.props.itemInfo.hasOwnProperty('image')) {
          return(
              <Image 
                  style={styles.image}
                  source={{uri: this.props.itemInfo.image.url}}
              />
          )
      }
      if (this.props.itemInfo.hasOwnProperty('text')) {
          return(
              <View style={styles.textBox}>
                  <Text style={styles.text}>{this.props.itemInfo.text.content}</Text>
              </View>
          )
      }
      return(<View/>);
  }
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    borderRadius: 33,
    marginLeft: -3,
    marginTop: -4,
    marginRight: -3,
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
    width: Dimensions.get('window').width*0.96-2, 
    height: (Dimensions.get('window').width*0.96-2)*8/7,
  },
  image: {
    flex: 1,
    borderRadius: 33,
    marginLeft: -3,
    marginTop: -4,
    marginRight: -3,
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
    width: Dimensions.get('window').width*0.96-2, 
    height: (Dimensions.get('window').width*0.96-2)*8/7,
    overflow: 'hidden',
  },
  textBox: {
    flex: 1,
    borderRadius: 33,
    marginLeft: -3,
    marginTop: -4,
    marginRight: -3,
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
    backgroundColor: 'rgb(250,250,250)', 
    width: Dimensions.get('window').width*0.96-4, 
  },
  text: {
    fontFamily: 'Avenir',
    padding: 20,
    textAlign: 'left',
  }
});

const mapDispatchToProps = (dispatch) => ({
	updateVideoPlaying: bindActionCreators(updateVideoPlaying, dispatch)
})

const mapStateToProps = (state, ownProps) => {
  const {video} = state.main;
  if(ownProps.hasOwnProperty('itemInfo')) {
    if (ownProps.itemInfo.hasOwnProperty('video')) {
      if (video.hasOwnProperty(ownProps.itemInfo.video.url)) {
        return {
          playing: state.main.currentVideoPlaying == ownProps.itemInfo.video.url
        }
      }
    }
  }
  return {playing: false}
}

export default connect(mapStateToProps,mapDispatchToProps)(FeedMediaItem);