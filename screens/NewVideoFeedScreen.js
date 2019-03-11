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

import {FRONT_SERVICE_URL} from '../Constants';

class NewVideoFeedScreen extends React.Component {
  state = {
    feedData: [],
  }

  _getFeedData = (continuous = false, errorCallback = () => {}) =>  {
    let postsFrom = continuous ? this.state.feedData.length : 0;
    fetch(FRONT_SERVICE_URL + '/getLatestFeedItems', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: this.props.screenProps.latitude,
        longitude: this.props.screenProps.longitude,
        getPostsFrom: postsFrom,
        jwt: this.props.userToken,
        getPostsTo: postsFrom+20
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (!responseJson.hasOwnProperty('error')) {
        if (continuous) {
          this.setState({feedData: this.state.feedData.concat(responseJson)});
        } else {
          this.setState({feedData: responseJson});
        }
        errorCallback(responseJson);
      } else {
        errorCallback(responseJson);
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