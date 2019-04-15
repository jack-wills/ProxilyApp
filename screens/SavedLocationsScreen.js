import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import SavedLocationsFeed from '../components/SavedLocationsFeed'
import {FRONT_SERVICE_URL} from '../Constants';

class SavedLocationsScreen extends React.Component {
  state = {
    error: "",
    data: [],
    noData: false
  }
  _navigateToFeed = (latitude, longitude, name) => {
    this.props.navigation.navigate('SavedLocationsFeed',{
        latitude: latitude,
        longitude: longitude,
        name: name,
    })
  }

  _getSavedLocations = async () => {
    fetch(FRONT_SERVICE_URL + '/service/getSavedLocations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
    })
    .then((response) => response.json())
    .then(async (responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
        console.log(responseJson.error)
        data = await AsyncStorage.getItem('savedLocations');
        this.setState({data: JSON.parse(data)});
      } else {
        if (responseJson.length == 0) {
          this.setState({noData: true});
        } else {
          this.setState({noData: false});
        }
        this.setState({data: responseJson});
        console.log(responseJson)
        await AsyncStorage.setItem('savedLocations', JSON.stringify(this.state.data));
      }
    })
    .catch(async (error) => {
      this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
      console.log(error);
      data = JSON.parse(await AsyncStorage.getItem('savedLocations'));
      if (data.length == 0) {
        this.setState({noData: true});
      } else {
        this.setState({noData: false});
      }
      this.setState({data: data});
    });
  }

  componentDidMount() {
    this._getSavedLocations();
  }

  _addSavedLocation = async (latitude, longitude, name) => {
    await fetch(FRONT_SERVICE_URL + '/service/putSavedLocation', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude,
        name: name,
      }),
    })
    .then((response) => response.json())
    .then(async (responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
        console.log(responseJson.error)
      } else {
        this.state.data.push({
          id: responseJson.id,
          latitude: latitude,
          longitude: longitude,
          name: name,
        })
        await AsyncStorage.setItem('savedLocations', JSON.stringify(this.state.data));
      }
    })
    .catch((error) => {
      this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
      console.log(error);
    });
  }

  _deleteSavedLocation = async (id) => {
    var array = [...this.state.data];
    let index;
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == id) {
        index = i;
        break;
      }
    }
    await fetch(FRONT_SERVICE_URL + '/service/removeSavedLocation', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        id: id,
      }),
    })
    .then((response) => response.json())
    .then(async (responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        let feedData = JSON.parse(await AsyncStorage.getItem('savedLocations'));
        this.setState({feedData: feedData == null ? [] : feedData});
        this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
        console.log(responseJson.error)
      } else {
        array.splice(index, 1);
        this.setState({data: array})
        await AsyncStorage.setItem('savedLocations', JSON.stringify(this.state.data));
      }
    })
    .catch(async (error) => {
      let feedData = JSON.parse(await AsyncStorage.getItem('savedLocations'));
      this.setState({feedData: feedData == null ? [] : feedData});
      this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
      console.log(error);
    });
  }

  render() {
    let feed;
    if (!this.state.data.length) {
      if (this.state.noData) {
        feed = (
          <View style={[styles.container, {flex: 1, padding: 34}]}>
            <View style={{flex:1, justifyContent: 'center'}}>
            <Text style={{fontFamily: 'Avenir', fontSize: 30, textAlign: 'center', marginBottom: 30}}>Welcome to your saved locations screen.</Text>
            </View>
            <View style={{flex:1}}>
            <Text style={{fontFamily: 'Avenir', fontSize: 18, textAlign: 'center', marginBottom: 20}}>Saved locations are a great way to keep up to date with areas when you're not around.</Text>
            <Text style={{fontFamily: 'Avenir', textAlign: 'center'}}>Press the plus in the top right corner to get started.</Text>
            </View>
          </View>
        );
      } else {
        feed = (
            <ActivityIndicator size="large" style={{marginTop: 20}}/>
        );
      }
    } else {
      feed = (
        <SavedLocationsFeed data={this.state.data} navigateToFeed={this._navigateToFeed} deleteItem={this._deleteSavedLocation}/>
      );
    }
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
              <Icon style={{paddingTop: 2, paddingRight: 20}} name='ios-menu' color='white' size={32}/>
            </View>
          </TouchableOpacity>
          <Image resizeMode={'contain'} source={require('../assets/logo4.png')} style={{flex:1, height: 32, marginTop: 5}}/>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('SavedLocationsAdd', {addSavedLocation: this._addSavedLocation}) }}>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginRight: 15, width: 40, height: 40 }}>
              <Icon style={{paddingTop: 2, paddingLeft: 20}} name='ios-add' color='white' size={32}/>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
        {feed}
        </View>
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

export default connect(mapStateToProps)(SavedLocationsScreen);