import React from 'react';
import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default class SettingsScreen extends React.Component {
  _renderItem = ({item}) => {
    return (
      <TouchableHighlight underlayColor={'#C7D7DD'} onPress={item.function}>
        <View style={styles.listButton}>
          <Text style={styles.buttonText}>{item.label}</Text>
        </View>
      </TouchableHighlight>
  )};

  render() {
    let data = [
      {
        label: "Change Profile Picture", 
        function: ()=>{}
      },{
        label: "Test2", 
        function: ()=>{}
      }
    ]
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
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <FlatList 
              data={data}
              keyExtractor={(item, index) => item.label}
              renderItem={this._renderItem}
              showsHorizontalScrollIndicator={false}
          />
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
  listButton: {
    height: 50,
    justifyContent: 'center',
    width: Dimensions.get('window').width,
  },
  buttonText: {
    fontFamily: 'Avenir',
    fontSize: 18,
    marginLeft: 20
  }
});
