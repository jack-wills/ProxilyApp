import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VideoFeed from '../components/VideoFeed';

export default class GlobalVideoFeedScreen extends React.Component {
    render() {
      return (
            <View>
              <View style={styles.container}>
              <VideoFeed  data={[{id: 5}]} />
              </View>
              <Text>Welcome to React Native!</Text>
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
  
  