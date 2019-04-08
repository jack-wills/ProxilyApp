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
import Icon from 'react-native-vector-icons/SimpleLineIcons'
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
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('Account')}>
          <View style={styles.drawerItem}>
            <Icon name="user" color={'#555'} size={25} />
            <Text style={styles.drawerText}>
              Account
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('MyPosts')}>
          <View style={styles.drawerItem}>
            <Icon name="speech" color={'#555'} size={25} />
            <Text style={styles.drawerText}>
              My Posts
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('Notifications')}>
          <View style={styles.drawerItem}>
            <Icon name="bulb" color={'#555'} size={25} />
            <Text style={styles.drawerText}>
              Notifications
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('Privacy')}>
          <View style={styles.drawerItem}>
            <Icon name="lock" color={'#555'} size={25} />
            <Text style={styles.drawerText}>
              Privacy
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('Help')}>
          <View style={styles.drawerItem}>
            <Icon name="question" color={'#555'} size={25} />
            <Text style={styles.drawerText}>
              Help/Support
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('About')}>
          <View style={styles.drawerItem}>
            <Icon name="info" color={'#555'} size={25} />
            <Text style={styles.drawerText}>
              About
            </Text>
          </View>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={async () => {await this.signOut();
                                                                              navigation.navigate('AuthLoading');}}>
          <View style={styles.drawerItem}>
            <Icon name="logout" color={'#555'} size={25} />
            <Text style={styles.drawerText}>
              Sign Out
            </Text>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    color: 'black',
    height: 50,
    paddingLeft: 10,
  },
  drawerText: {
    fontSize: 18,
    fontFamily: 'Avenir',
    paddingLeft: 10,
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