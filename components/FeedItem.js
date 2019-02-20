import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import FeedMediaItem from './FeedMediaItem';

export default class FeedItem extends React.Component {
    state = {
      user: "test",
      videoPlaying: false,
    }
    _onPressVideo = () => {
      var videoPlayingTemp = this.state.videoPlaying
      this.setState({videoPlaying: !videoPlayingTemp})
    };
    _onPressComments = () => {
      this.setState({user: "Jack"});
      this.props.openItemComments(this.props.item);
    };
    
    render() {
      var mediaItem = this.props.mediaItem;
      if (mediaItem.hasOwnProperty('video')){
          mediaItem.video.videoPlaying = this.state.videoPlaying;
          mediaItem.video.onPressVideo = this._onPressVideo;
      }
      return (
          <View style={styles.container}>
            <FeedMediaItem itemInfo={mediaItem}/>
            <View style={styles.info}>
                <View style={styles.left}>
                    <Text style={styles.subByText}>Submitted By {this.state.user}</Text>
                    <Text style={styles.commentsText} onPress={this._onPressComments}>Comments...</Text>
                </View>
                    <View style={styles.right}>
                </View>
            </View>
          </View>
      );
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: "column",
      backgroundColor: 'white',
      borderRadius: 33,
      borderWidth: 1,
      borderColor: 'rgb(230,230,230)',
      padding:0,
      marginTop: 10,
    },
    info: {
      flex: 1,
      height: 70,
      width: Dimensions.get('window').width*0.83,
      paddingTop: 10,
      paddingBottom: 5,
      flexDirection: "row",
      //width: 350,
    },
    left: {
      width: Dimensions.get('window').width*0.415,
      //backgroundColor: 'blue',
    },
    right: {
  
      width: Dimensions.get('window').width*0.415,
      //backgroundColor: 'red',
    },
    subByText: {
      fontFamily: 'Avenir',
      fontSize: 15,
    },
    commentsText: {
      marginTop: 7,
      color: 'grey',
      fontFamily: 'Avenir',
      fontSize: 13,
    },
    comments: {
      flex: 1,
      width: Dimensions.get('window').width*0.83,
      paddingTop: 10,
      paddingBottom: 5,
      flexDirection: "row",
    },
    comment: {
      flex: 1,
      borderTopWidth: 1,
      borderTopColor: 'lightgrey',
      padding: 10,
      width: Dimensions.get('window').width*0.9,
      height: Dimensions.get('window').height*0.1,
    }
  });
  