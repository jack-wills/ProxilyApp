import React from 'react'
import { 
  AsyncStorage, 
  Dimensions, 
  StyleSheet, 
  SafeAreaView, 
  Text, 
  TouchableHighlight, 
  View, 
  Image 
} from 'react-native'
import {connect} from 'react-redux';
import { AccessToken, LoginManager, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

class DrawerComponent extends React.Component {
  async facebookLogout() {
    var current_access_token = '';
    await AccessToken.getCurrentAccessToken().then(async (data) => {
      current_access_token = data.accessToken.toString();
    }).then(async () => {
      let logout =
      await new GraphRequest(
        "me/permissions/",
        {
            accessToken: current_access_token,
            httpMethod: 'DELETE'
        },
        async (error, result) => {
            if (error) {
                console.log('Error fetching data: ' + error.toString());
            } else {
                await LoginManager.logOut();
            }
        });
      await new GraphRequestManager().addRequest(logout).start();
    })
    .catch(error => {
      console.log(error)
    });      
  }
    async signOut(navigation) {
        try {
          if (this.props.isFacebook) {
            await this.facebookLogout();
          }
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('tokenProvider');
        } catch(error) {
            console.log('error: ', error);
        }
   }

  render() {
    const navigation = this.props.navigation
    return (
      <SafeAreaView style={{backgroundColor: '#87B7CB', flex:1}}>
      <View style={styles.drawerHeader}>
          <Image
            style={styles.drawerImage}
            source={{uri: this.props.profilePicture}} />
          <Text style={styles.drawerHeaderText}>{this.props.name}</Text>
      </View>
      <View style={styles.container}>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('Feed')}>
          <Text
            style={styles.drawerItem}>
            Local Feed
          </Text>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('Settings')}>
          <Text
            style={styles.drawerItem}>
            Settings
          </Text>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={async () => {await this.signOut();
                                                                              navigation.navigate('AuthLoading');}}>
          <Text
            style={styles.drawerItem}>
            Sign Out
          </Text>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
      </View>
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height*0.9,
    flex: 1,
  },
  drawerItem: {
    fontSize: 18,
    fontFamily: 'Avenir',
    color: 'black',
    height: 50,
    paddingLeft: 10,
    paddingTop: 13,
  },
  drawerHeader: {
    height: Dimensions.get('window').height*0.1,
    flexDirection: "row",
    alignItems: 'center',
    backgroundColor: '#87B7CB',
    shadowRadius: 3,
    shadowColor: 'grey',
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
    zIndex: 3,
  },
  drawerHeaderText: {
    fontSize: 18,
    fontFamily: 'Avenir',
    paddingLeft: 15,
  },
  drawerImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 15,
  },
  lineBreak: {
    alignSelf: 'center',
    backgroundColor: 'black', 
    height: 1,
    width: Dimensions.get('window').width*0.67,
  }
})

const mapStateToProps = (state) => {
  const {userToken, name, profilePicture, isFacebook} = state.main;
  return {userToken, name, profilePicture, isFacebook};
}

export default connect(mapStateToProps)(DrawerComponent);