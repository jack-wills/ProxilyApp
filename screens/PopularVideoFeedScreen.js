import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VideoFeed from '../components/VideoFeed';

export default class PopularVideoFeedScreen extends React.Component {
    render() {
      let feedData = [{"id":0,"userVote":0,"totalVotes":500,"media":{text: {content:"test"}},"submitter":"Home"},{"id":1,"userVote":0,"totalVotes":400,"media":"{image: \"test\"}","submitter":"Jack123"},{"id":2,"userVote":0,"totalVotes":200,"media":"{video: \"test\"}","submitter":"Jack"},{"id":3,"userVote":0,"totalVotes":90,"media":"{text: \"test1\"}","submitter":"Home"}];
      /*let feedData = [
        {
          id: 1, 
          media: {
            video: {
              url: 'file:///Users/Jack/Desktop/videoApp/assets/sample.mp4',
            }
          },
          submitter: 'Jack',
          userVote: 1,
          totalVotes: 12130,
        },
        {
          id: 2, 
          media: {
            text: {
              content: 'Test 123',
            }
          },
          submitter: 'Jack',
          userVote: 1,
          totalVotes: 782130,
        },
        {
          id: 3, 
          media: {
            image: {
              url: 'file:///Users/Jack/Desktop/videoApp/assets/mountains.jpg',
            }
          },
          submitter: 'Jack',
          userVote: 1,
          totalVotes: 14120,
        },
        {
          id: 4, 
          media: {
            text: {
              content: 'This is a multi line text post\nThis is a multi line text post\nThis is a multi line text post\nThis is a multi line text post\nThis is a multi line text post',
            }
          },
          submitter: 'Jack',
          userVote: 1,
          totalVotes: 62100,
        }]*/
      return (
            <View>
              <View style={styles.container}>{}
              <VideoFeed  data={feedData} navigation={this.props.navigation} />
              </View>
            </View>
      );
    }
  }
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: '#D7E7ED',
    },
  });
  
  