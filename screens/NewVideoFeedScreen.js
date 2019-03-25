import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import VideoFeed from '../components/VideoFeed';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/AntDesign';

import {FRONT_SERVICE_URL} from '../Constants';

class NewVideoFeedScreen extends React.Component {
  state = {
    feedData: [],
    noData: false
  }

  _getFeedData = async (continuous = false, callback = () => {}) =>  {
    let postsFrom = continuous ? this.state.feedData.length : 0;
    await fetch(FRONT_SERVICE_URL + '/getLatestFeedItems', {
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
      if (continuous) {
        this.setState({feedData: this.state.feedData.concat(responseJson)});
      } else {
        this.setState({feedData: responseJson});
      }
      callback(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
  }

  callback = (responseJson) => {
    if (responseJson.hasOwnProperty('error')) {
      this.setState({noData: true});
      if (responseJson.error === "OBJECT_NOT_FOUND") {
      } else {
        console.log("Couldn't get feed data because: " + responseJson.error);
      }
    } else {
      this.setState({noData: false});
    }
  }

  componentDidMount() {
    this._getFeedData(false, this.callback);
  }

  render() {
    if (!this.state.feedData.length) {
      if (this.state.noData) {
        return (
          <View style={[styles.container, {flex: 1}]}>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
              this.setState({noData: false});
              this._getFeedData(false, this.callback);
            }}>
              <Text style={{marginBottom: 10, fontFamily: 'Avenir', fontSize: 17}}>Tap to reload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
              this.setState({noData: false});
              this._getFeedData(false, this.callback);
            }}>
              <Icon name={"reload1"} size={40} color="grey"/>
            </TouchableOpacity>
          </View>
        );
      }
      return (
          <View style={[styles.container, {height: Dimensions.get('window').height, width: Dimensions.get('window').width}]}>
          <ActivityIndicator size="large" style={{marginTop: 20}}/>
          </View>
      );
    } else {
      return (
          <View style={styles.container}>
          <VideoFeed data={this.state.feedData} navigation={this.props.navigation} getFeedData={this._getFeedData} />
          </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#D7E7ED',
    justifyContent: 'center',
  },
});
  
const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(NewVideoFeedScreen);