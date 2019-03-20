import React from 'react';
import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';

import SavedLocationsFeed from '../components/SavedLocationsFeed'
import {FRONT_SERVICE_URL} from '../Constants';

class SavedLocationsScreen extends React.Component {
  state = {
    data: []
  }
  _navigateToFeed = (latitude, longitude, name) => {
    this.props.navigation.navigate('SavedLocationsFeed',{
        latitude: latitude,
        longitude: longitude,
        name: name,
    })
  }

  _getSavedLocations = () => {
    fetch(FRONT_SERVICE_URL + '/getSavedLocations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwt: this.props.userToken,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        console.log(responseJson.error)
      } else {
        this.setState({data: responseJson});
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  componentDidMount() {
    this._getSavedLocations();
  }

  _addSavedLocation = async (latitude, longitude, name) => {
    await fetch(FRONT_SERVICE_URL + '/putSavedLocation', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: latitude,
        longitude: longitude,
        name: name,
        jwt: this.props.userToken,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        console.log(responseJson.error)
      } else {
        this.state.data.push({
          id: responseJson.id,
          latitude: latitude,
          longitude: longitude,
          name: name,
        })
      }
    })
    .catch((error) => {
      console.error(error);
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
    await fetch(FRONT_SERVICE_URL + '/removeSavedLocation', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id,
        jwt: this.props.userToken,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        console.log(responseJson.error)
      } else {
        array.splice(index, 1);
        this.setState({data: array})
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    let feed;
    if (!this.state.data.length) {
      feed = (
          <ActivityIndicator size="large" style={{marginTop: 20}}/>
      );
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
      </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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