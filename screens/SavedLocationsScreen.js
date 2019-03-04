import React from 'react';
import {
  Button,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

import SavedLocationsFeed from '../components/SavedLocationsFeed'

export default class SavedLocationsScreen extends React.Component {
  state = {
    data: [{
      id: 1,
      lat: 37.78825,
      long: -122.4324,
      name: 'London'
    }, {
      id: 2,
      lat: 37.78825,
      long: -122.4324,
      name: 'Home'
    },{
      id: 3,
      lat: 51.923187,
      long: -0.226379,
      name: 'Should Work'
    }]
  }
  _navigateToFeed = (lat, long, name) => {
    this.props.navigation.navigate('SavedLocationsFeed',{
        latitude: lat,
        longitude: long,
        name: name,
    })
  }

  _addSavedLocation = (latitude, longitude, name) => {
    this.state.data.push({
      id: this.state.data.length+1,
      lat: latitude,
      long: longitude,
      name: name,
    })
    //TODO Add call to endpoint
  }

  _deleteSavedLocation = (index) => {
    var array = [...this.state.data];
    array.splice(index-1, 1);
    this.setState({data: array})
    //TODO Add call to endpoint
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
              <Icon style={{paddingTop: 2, paddingRight: 20}} name='ios-menu' color='white' size={32}/>
            </View>
          </TouchableOpacity>
          <Image resizeMode={'contain'} source={{uri: "file:///Users/Jack/Desktop/videoApp/assets/logo4.png"}} style={{flex:1, height: 38}}/>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('SavedLocationsAdd', {addSavedLocation: this._addSavedLocation}) }}>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginRight: 15, width: 40, height: 40 }}>
              <Icon style={{paddingTop: 2, paddingLeft: 20}} name='ios-add' color='white' size={32}/>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <SavedLocationsFeed data={this.state.data} navigateToFeed={this._navigateToFeed} deleteItem={this._deleteSavedLocation}/>
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
