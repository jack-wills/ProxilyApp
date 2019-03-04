import React from 'react';
import {
    Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView from 'react-native-maps';
import Icon from 'react-native-vector-icons/Ionicons'

class MyListItem extends React.PureComponent {
    _onPress = () => {
      this.props.navigateToFeed(this.props.lat, this.props.long, this.props.name);
    };

    _deleteItem = () => {
      this.props.deleteItem(this.props.id);
    };
  
    render() {
        let circleSize = (150*0.0724)/0.15;
      return (
        <TouchableOpacity onPress={this._onPress}>
            <View style={styles.container}>
                <View style={{width: (Dimensions.get('window').width*0.48)-15, height: 180, justifyContent: 'center'}}>
                    <TouchableOpacity style={{position: 'absolute', top: 0, left: 4}} onPress={this._deleteItem}>
                        <Icon name="ios-close" color={'grey'} size={34} />
                    </TouchableOpacity>
                    <Text style={{textAlign: 'center', fontSize: 20, fontFamily: 'Avenir'}}>{this.props.name}</Text>
                </View>
                <View style={{width: (Dimensions.get('window').width*0.48)-15}}>
                <View pointerEvents="none" style={styles.map}>
                    <MapView
                        style={styles.map}
                        scrollEnabled={false}
                        zoomEnabled={false}
                        pitchEnabled={false}
                        rotateEnabled={false}
                        initialRegion={{
                            latitude: this.props.lat,
                            longitude: this.props.long,
                            latitudeDelta: 0.15,
                            longitudeDelta: 0.15,
                        }}
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
                </View>
                </View>
            </View>
        </TouchableOpacity>
      );
    }
  }
  
export default class SavedLocationsFeed extends React.Component {

  _keyExtractor = (item, index) => index.toString();

  _renderItem = ({item}) => (
      <MyListItem
      id={item.id}
      lat={item.lat}
      long={item.long}
      name={item.name}
      navigateToFeed={this.props.navigateToFeed}
      deleteItem={this.props.deleteItem}
      />
  );

  render() {
      return (
        <FlatList 
            data={this.props.data}
            extraData={this.state}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
      );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: "row",
    backgroundColor: 'white',
    borderRadius: 33,
    borderWidth: 1,
    borderColor: 'rgb(230,230,230)',
    padding:10,
    marginTop: 10,
    marginBottom: 5,
    shadowRadius: 4,
    shadowColor: 'grey',
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.3,
    width: Dimensions.get('window').width*0.96,
    height: 200,
  },
  map: {
      width: 150,
      height: 150,
      borderRadius: 25,
  }
});
