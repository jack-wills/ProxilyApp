import React from 'react';
import {
  Button,
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { MAP_TYPES, Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const ASPECT_RATIO = Dimensions.get('window').width/Dimensions.get('window').height;

export default class SavedLocationsAddScreen extends React.Component {

  state = {
    region: {
      latitude: 37.78825,
      longitude: -122.4324,
      latitudeDelta: 0.2522,
      longitudeDelta: 0.2522*ASPECT_RATIO
    },
  };
  constructor(props) {
    super(props);
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  getCoordsFromName(data, details = null) {
    this.map.animateCamera({
        center: {
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
      }});
  }

  render() {
    let circleSize = (Dimensions.get('window').height*0.0724)/this.state.region.latitudeDelta;
    console.log(this.state.region.latitudeDelta)
    return (
        <View style={styles.container}>
          <View style={{position: 'absolute', top:40, zIndex: 100, width: Dimensions.get('window').width*0.9, flexDirection: 'row'}}>
          <TouchableOpacity style={{marginRight: 5, marginTop: 7}} onPress={() => { this.props.navigation.goBack() }}>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', width: 40, height: 40, }}>
              <Icon name="ios-arrow-back" color={'grey'} size={38} />
            </View>
          </TouchableOpacity>
          <GooglePlacesAutocomplete
              styles={{
                textInputContainer: {
                  backgroundColor: 'rgba(0,0,0,0)',
                  borderTopWidth: 0,
                  borderBottomWidth:0
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  height: 38,
                  color: '#5d5d5d',
                  fontSize: 16
                },
                description: {
                  fontSize: 10
                },
                listView: {
                  backgroundColor: 'white',
                }}}
              placeholder='Search'
              minLength={2}
              autoFocus={true}
              returnKeyType={'search'} 
              listViewDisplayed={false}
              fetchDetails={true}
              enablePoweredByContainer={false}
              onPress={(data, details = null) => this.getCoordsFromName(data, details)}
              query={{
                  key: 'AIzaSyB9G2HJu_Xll1dG_G5dtvvLBNvvEB0DFsM',
                  language: 'en'
              }}
              nearbyPlacesAPI='GooglePlacesSearch'
              debounce={200}
          />
          </View>
          <View style={styles.map}>
            <MapView
            provider={this.props.provider}
            ref={ref => { this.map = ref; }}
            mapType={MAP_TYPES.STANDARD}
            style={styles.map}
            pitchEnabled={false}
            rotateEnabled={false}
            initialRegion={this.state.region}
            onRegionChange={region => this.onRegionChange(region)}
          />
          <View pointerEvents="none" style={{
            left: '50%',
            marginLeft: -0.5 * circleSize,
            marginTop: -0.5 * circleSize,
            position: 'absolute',
            top: '50%', 
            height: circleSize, 
            width: circleSize,
            backgroundColor: '#62f8d13f',
            borderRadius: 0.5 * circleSize,
            borderColor: '#2faa71',
            borderWidth: 1,
          }} />
          <View pointerEvents="none" style={styles.markerFixed}>
            <Image resizeMode={'cover'} style={styles.marker} source={{uri: 'file:///Users/Jack/Desktop/videoApp/assets/marker.png'}} />
          </View>
          </View>
          <TextInput style={[styles.bubble, styles.latlng, {bottom: 90}]} placeholder={"Location Name"} onChangeText={(text) => this.setState({name: text})}/>
          <TouchableOpacity style={[styles.bubble, styles.latlng]} onPress={() => { 
            this.props.navigation.state.params.addSavedLocation(this.state.region.latitude, this.state.region.longitude, this.state.name);
            this.props.navigation.goBack()
          }}>
            <Text style={{ textAlign: 'center', fontFamily: 'Avenir', fontSize: 17}}>Save Location</Text>
          </TouchableOpacity>
        </View>
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
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -46,
    position: 'absolute',
    top: '50%'
  },
  marker: {
    height: 48,
    width: 48
  },
  topBar: {
    flex: 0,
    fontSize: 20,
    fontFamily: 'Avenir',
    textAlign: "left",
    padding: 10,
    paddingLeft: 20,
  },
  map: {
    height: Dimensions.get('window').height, 
    width: Dimensions.get('window').width,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    position: 'absolute', 
    bottom:40, 
    zIndex: 100,
    width: 200,
    alignItems: 'stretch',
  },
});
