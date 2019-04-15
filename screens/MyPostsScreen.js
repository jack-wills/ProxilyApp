import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Image,
  View,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';
import VideoFeed from '../components/VideoFeed';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';

import {FRONT_SERVICE_URL} from '../Constants';

class MyPostsScreen extends React.Component {
  state = {
    feedData: [],
    error: "",
    noData: false
  }

  _getFeedData = async (callback = () => {}) =>  {
    await fetch(FRONT_SERVICE_URL + '/service/getMyPosts', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
    })
    .then((response) => response.json())
    .then(async (responseJson) => {
      if (!responseJson.hasOwnProperty('error')) {
        this.setState({feedData: responseJson});
        await AsyncStorage.setItem('myPosts', JSON.stringify(this.state.feedData));
      } else {
        let feedData = JSON.parse(await AsyncStorage.getItem('myPosts'));
        this.setState({feedData: feedData == null ? [] : feedData});
        this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
      }
      callback(responseJson);
    })
    .catch(async (error) => {
      let feedData = JSON.parse(await AsyncStorage.getItem('myPosts'));
      this.setState({feedData: feedData == null ? [] : feedData});
      this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
      console.log(error);
    });
  }
  
  callback = (responseJson) => {
    if (responseJson.hasOwnProperty('error')) {
      console.log("Couldn't get feed data because: " + responseJson.error);
      this.setState({noData: true});
    } else {
      if (responseJson.length == 0) {
        this.setState({noData: true});
      } else {
        this.setState({noData: false});
      }
    }
  }
  
  componentDidMount() {
    this._getFeedData(this.callback);
  }
  
  renderFeed() {
    if (!this.state.feedData.length) {
      if (this.state.noData) {
        let callback = this.callback;
        return (
          <View style={[styles.container, {justifyContent: 'center', height: Dimensions.get('window').height, width: Dimensions.get('window').width}]}>
            <Text style={{width: Dimensions.get('window').width*0.7, marginBottom: 20, fontFamily: 'Avenir', fontSize: 20, textAlign: 'center'}}>You haven't got any posts at the minute</Text>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
              this.setState({noData: false});
              this._getFeedData(callback);
            }}>
              <Text style={{marginBottom: 10, fontFamily: 'Avenir', fontSize: 17}}>Tap to reload</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{alignItems: 'center'}} onPress={() => {
              this.setState({noData: false});
              this._getFeedData(callback);
            }}>
              <Icon name={"reload1"} size={40} color="grey"/>
            </TouchableOpacity>
          </View>
        );
      }
      return (
          <View style={[styles.container, {justifyContent: 'center', height: Dimensions.get('window').height, width: Dimensions.get('window').width}]}>
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
      console.log(this.state.feedData)
      return (
          <View style={styles.container}>
          <VideoFeed  data={this.state.feedData} navigation={this.props.navigation} getFeedData={() => {}} />
          </View>
      );
    }
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#02b875', flex: 1}}>
        <View style={{flexDirection:'row', 
                      backgroundColor: '#02b875',
                      shadowRadius: 4,
                      shadowColor: 'grey',
                      shadowOffset: {height: 6, width: 0},
                      shadowOpacity: 0.3,
                      justifyContent: 'center',
                      flexDirection: "row",
                      zIndex: 1, height: 42}}>
          <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginLeft: 15, width: 40, height: 40 }}>
              <IonIcon style={{paddingTop: 2, paddingRight: 20}} name='ios-menu' color='white' size={32}/>
            </View>
          </TouchableOpacity>
          <Image resizeMode={'contain'} source={require('../assets/myPostsLogo.png')} style={{flex:1, height: 32, marginTop: 5}}/>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('SavedLocationsAdd', {addSavedLocation: this._addSavedLocation}) }}>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginRight: 15, width: 40, height: 40 }}>
            </View>
          </TouchableOpacity>
        </View>
        {this.renderFeed()}
        <Modal
          isVisible={this.state.error != "" && this.props.navigation.isFocused()}
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
    </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7E7ED',
  },
  topBar: {
    flex: 0,
    fontSize: 20,
    fontFamily: 'Avenir',
    textAlign: "left",
    padding: 10,
    paddingLeft: 20,
  },
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(MyPostsScreen);