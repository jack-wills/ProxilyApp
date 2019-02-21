import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VideoFeed from '../components/VideoFeed';

export default class NewVideoFeedScreen extends React.Component {
    render() {
      return (
            <View>
              <View style={styles.container}>
              <VideoFeed  data={[
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
              }]} navigation={this.props.navigation}/>
              </View>
            </View>
      );
    }
  }
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: '#F5FCFF',
      height: SCREEN_HEIGHT*0.8,
    },
  });
  
  