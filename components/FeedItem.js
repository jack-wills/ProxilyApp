import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  View,
} from 'react-native';
import FeedMediaItem from './FeedMediaItem';
import { Icon1 } from 'react-native-vector-icons/Ionicons';

export default class FeedItem extends React.Component {
    state = {
      user: "test",
      videoPlaying: false,
      userVote: 0
    }
    _onPressVideo = () => {
      var videoPlayingTemp = this.state.videoPlaying
      this.setState({videoPlaying: !videoPlayingTemp})
    };
    _onPressComments = () => {
      this.setState({user: "Jack"});
      this.props.openItemComments(this.props.item);
    };

    _onPressUpvote = () => {
        if (this.state.userVote == 1) {
            this.setState({userVote: 0});
        } else {
            this.setState({userVote: 1});
        }
    };
    _onPressDownvote = () => {
        if (this.state.userVote == -1) {
            this.setState({userVote: 0});
        } else {
            this.setState({userVote: -1});
        }
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
                    <Text style={styles.subByText}>Submitted by {this.state.user}</Text>
                    <Text style={styles.commentsText} onPress={this._onPressComments}>Comments...</Text>
                </View>
                <View style={styles.right}>
                    <TouchableOpacity onPress={this._onPressUpvote}>
                    <Image 
                        style={{flex:0, height: 26, width: 26}}
                        source={this.state.userVote == 1 ? require('../assets/upvotepressed.png'): require('../assets/upvote.png')}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onPressDownvote}>
                    <Image 
                        style={{flex:0, height: 26, width: 26, marginLeft: 10, marginTop: 2}}
                        source={this.state.userVote == -1 ? require('../assets/downvotepressed.png'): require('../assets/downvote.png')}
                    />
                    </TouchableOpacity>
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
      justifyContent: 'center',
      flexDirection: 'row',
      marginTop: 10,
      marginLeft: 20,
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
    }
  });
  