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
  state = {
    feedData: [],
  }

  _getFeedData = () =>  {
    fetch('http://localhost:8080/getLatestFeedItems', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: "51.923187",
        longitude: "-0.226379",
        getPostsFrom: "0",
        jwt: "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYWNrdzUzNTE5QGdtYWlsLmNvLnVrIiwiZmlyc3ROYW1lIjoiamFjayIsImxhc3ROYW1lIjoid2lsbGlhbXMiLCJpYXQiOjE1NTEzNTc2NjcsImV4cCI6MTU1MTQ0NDA2N30.3TO3MlyE38yanWBrNfTfahtrVAZIClMD50PmcKgRpbc",
        getPostsTo: "20"
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty("error")) {
        console.log("Couldn't get feed data because: " + responseJson.error)
      } else {
        this.setState({feedData: responseJson});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }


  componentDidMount() {
    this._getFeedData();
  }

  render() {
    return (
          <View>
            <View style={styles.container}>
            <VideoFeed  data={this.state.feedData} navigation={this.props.navigation} getFeedData={this._getFeedData} />
            </View>
          </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#D7E7ED',
  },
});
  
  