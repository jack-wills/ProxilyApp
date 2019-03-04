import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import VideoFeed from '../components/VideoFeed';
import {connect} from 'react-redux';

class NewVideoFeedScreen extends React.Component {
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
        latitude: this.props.screenProps.latitude,
        longitude: this.props.screenProps.longitude,
        getPostsFrom: "0",
        jwt: this.props.userToken,
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
        <View style={styles.container}>
        <VideoFeed  data={this.state.feedData} navigation={this.props.navigation} getFeedData={this._getFeedData} />
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
  
const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(NewVideoFeedScreen);