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
      return (
            <View>
              <View style={styles.container}>{}
              <VideoFeed  data={[
              {
                id: 1, 
                media: {
                  video: {
                    url: 'file:///Users/Jack/Desktop/videoApp/assets/sample.mp4',
                  }
                }
              },
              {
                id: 2, 
                media: {
                  text: {
                    content: 'Test 123',
                  }
                }
              },
              {
                id: 3, 
                media: {
                  image: {
                    url: 'file:///Users/Jack/Desktop/videoApp/assets/mountains.jpg',
                  }
                }
              },
              {
                id: 4, 
                media: {
                  text: {
                    content: 'This is a multi line text post\nThis is a multi line text post\nThis is a multi line text post\nThis is a multi line text post\nThis is a multi line text post',
                  }
                }
              }]} navigation={this.props.navigation} />
              </View>
            </View>
      );
    }
  }
  const SCREEN_HEIGHT = Dimensions.get('window').height;
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      backgroundColor: '#F0F6F9',
      height: SCREEN_HEIGHT*0.8,
    },
    welcome: {
      fontSize: 20,
      textAlign: 'center',
      margin: 10,
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
    },
  });
  
  