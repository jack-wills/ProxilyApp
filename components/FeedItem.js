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

export default class FeedItem extends React.Component {
    state = {
      videoPlaying: false,
      userVote: this.props.item.userVote,
    }
    _onPressVideo = () => {
      var videoPlayingTemp = this.state.videoPlaying
      this.setState({videoPlaying: !videoPlayingTemp})
    };
    _onPressComments = () => {
      this.props.openItemComments(this.props.item);
    };

    _onPressUpvote = () => {
        if (this.state.userVote == 1) {
            //TODO call service to set state
            this.setState({userVote: 0});
            this.props.item.userVote = 0;
        } else {
            this.setState({userVote: 1});
            //TODO call service to set state
            this.props.item.userVote = 1;
        }
    };
    _onPressDownvote = () => {
        if (this.state.userVote == -1) {
            this.setState({userVote: 0});
            //TODO call service to set state
            this.props.item.userVote = 0;
        } else {
            this.setState({userVote: -1});
            //TODO call service to set state
            this.props.item.userVote = -1;
        }
    };
    
    renderNormal() {
      var mediaItem = this.props.item.media;
      if (mediaItem.hasOwnProperty('video')){
          mediaItem.video.videoPlaying = this.state.videoPlaying;
          mediaItem.video.onPressVideo = this._onPressVideo;
      }
      return (
          <View style={styles.container}>
            <FeedMediaItem itemInfo={mediaItem}/>
            <View style={styles.info}>
                <View style={styles.left}>
                    <Text style={styles.subByText}>Submitted by {this.props.item.submitter}</Text>
                    <Text style={styles.commentsText} onPress={this._onPressComments}>Comments...</Text>
                </View>
                <View style={styles.right}>
                    <Text style={styles.voteText}>{this.props.item.totalVotes+this.state.userVote}</Text>
                    <TouchableOpacity onPress={this._onPressUpvote}>
                    <Image 
                        style={{flex:0, height: 26, width: 26, marginLeft: 10}}
                        source={this.state.userVote == 1 ? require('../assets/upvotepressed.png'): require('../assets/upvote.png')}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onPressDownvote}>
                    <Image 
                        style={{flex:0, height: 26, width: 26, marginLeft: 8, marginTop: 2}}
                        source={this.state.userVote == -1 ? require('../assets/downvotepressed.png'): require('../assets/downvote.png')}
                    />
                    </TouchableOpacity>
                </View>
            </View>
          </View>
      );
    }

    renderExtended() {
        var mediaItem = this.props.item.media;
        if (mediaItem.hasOwnProperty('video')){
            mediaItem.video.videoPlaying = this.state.videoPlaying;
            mediaItem.video.onPressVideo = this._onPressVideo;
        }
      return (
        <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
        <FeedMediaItem itemInfo={mediaItem}/>
        <View style={styles.comments}>
            <View style={styles.left}>
            <Text style={styles.subByText}>Submitted by {this.props.item.submitter}</Text>
            </View>
            <View style={styles.right}>
            </View>
            </View>
            <FlatList
              data={item.comments}
              renderItem={({item}) => (
                <View style={styles.comment}>
                <Text>{item.user}</Text>
                <Text>{item.body}</Text>
                </View>
              )}
            />
          </View>
          </ScrollView>
      );
    }

    render() {
        if (this.props.extended) {
            return this.renderExtended();
        }
        return this.renderNormal();
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
      marginTop: 5,
      marginBottom: 5,
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
    },
    voteText: {
        marginTop: 5,
        fontFamily: 'Avenir',
    }
  });
  