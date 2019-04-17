import React from 'react';
import {
  CameraRoll,
  Dimensions,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';

import CachedImage from '../components/CachedImage';

class AccountScreen extends React.Component {
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
        function: async () => {
          let photos = await CameraRoll.getPhotos({});
          console.log(photos)
        }
      },{
        label: "Change Name", 
        function: ()=>{}
      },{
        label: "Change Password", 
        function: ()=>{}
      }
    ]
    let list;
    if (this.props.userToken.startsWith("facebook")) {
      list = (
        <Text style={styles.buttonText}>You cannot edit your account if signed in with Facebook</Text>
      )
    } else {
      list = (
        <FlatList 
            data={data}
            keyExtractor={(item, index) => item.label}
            renderItem={this._renderItem}
            showsHorizontalScrollIndicator={false}
        />
      )
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
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <View style={styles.accountBar}>
            <CachedImage
              style={styles.drawerImage}
              source={{uri: this.props.profilePicture}} />
            <Text style={styles.nameText}>{this.props.name}</Text>
          </View>
          <View style={styles.lineBreak}/>
          <View style={styles.feed}> 
            {list}
          </View>
        </View>
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  drawerImage: {
    height: Dimensions.get('window').height*0.14,
    width: Dimensions.get('window').height*0.14,
    borderRadius: Dimensions.get('window').height*0.07,
  },
  accountBar: {
    height: Dimensions.get('window').height*0.25,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  nameText: {
    fontFamily: 'Avenir',
    fontSize: 25,
  },
  lineBreak: {
    alignSelf: 'center',
    backgroundColor: 'black', 
    height: 1,
    width: Dimensions.get('window').width*0.85,
    marginBottom: 10
  },
  feed: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
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

const mapStateToProps = (state) => {
  const {userToken, name, profilePicture} = state.main;
  return {userToken, name, profilePicture};
}

export default connect(mapStateToProps)(AccountScreen);