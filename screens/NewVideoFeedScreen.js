import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
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
import Modal from 'react-native-modal';

import {FRONT_SERVICE_URL} from '../Constants';

class NewVideoFeedScreen extends React.Component {
  state = {
    feedData: [],
    error: "",
    noData: false
  }

  _getFeedData = async (continuous = false, callback = () => {}) =>  {
    let postsFrom = continuous ? this.state.feedData.length : 0;
    await fetch(FRONT_SERVICE_URL + '/service/getLatestFeedItems', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        latitude: this.props.screenProps.latitude,
        longitude: this.props.screenProps.longitude,
        getPostsFrom: postsFrom,
        getPostsTo: postsFrom+20
      }),
    })
    .then((response) => response.json())
    .then(async (responseJson) => {
      if (!responseJson.hasOwnProperty('error')) {
        if (continuous) {
          this.setState({feedData: this.state.feedData.concat(responseJson)});
        } else {
          this.setState({feedData: responseJson});
        }
        await AsyncStorage.setItem('feedData', JSON.stringify(this.state.feedData));
      } else {
        if (!continuous) {
          this.setState({feedData: JSON.parse(await AsyncStorage.getItem('feedData'))});
        }
        this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
      }
      callback(responseJson);
    })
    .catch(async (error) => {
      if (!continuous) {
        this.setState({feedData: JSON.parse(await AsyncStorage.getItem('feedData'))});
      }
      this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
      console.log(error);
    });
  }

  callback = (responseJson) => {
    if (responseJson.hasOwnProperty('error')) {
      this.setState({noData: true});
      console.log("Couldn't get feed data because: " + responseJson.error);
    } else {
      if (responseJson.length == 0) {
        this.setState({noData: true});
      } else {
        this.setState({noData: false});
      }
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
          <Modal
              isVisible={this.state.error != ""}
              onBackdropPress={() => this.setState({ error: "" })}>
              <View style={{alignSelf: 'center',
                  justifySelf: 'center',
                  width: Dimensions.get('window').width*0.6,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  shadowRadius: 4,
                  shadowColor: 'grey',
                  shadowOffset: {height: 2, width: 0},
                  shadowOpacity: 0.25,
                  overflow: 'hidden',
                  padding: 15,
              }}>
              <Text style={{fontFamily: 'Avenir'}}>{this.state.error}</Text>
              </View>
          </Modal>
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