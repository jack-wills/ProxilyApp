import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Dimensions,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import { AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import {fetchUserToken} from '../actions/UpdateUserToken';
import Modal from 'react-native-modal';

import {FRONT_SERVICE_URL} from '../Constants';

class AuthLoadingScreen extends React.Component {
  state = {
    error: ""
  }
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _checkTokenAsync = async (userToken) => {
    this.props.dispatch( async (dispatch) => {
      try {
        let response = await fetch(FRONT_SERVICE_URL + '/service/checkToken', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userToken,
          },
        })
        let responseJson = await response.json();
        if (responseJson.hasOwnProperty('error')) {
          this.setState({error: "Oops, looks like something went wrong."});
          this.setState({error: responseJson});
          console.log(responseJson.error)
          this.props.navigation.navigate('Auth');
        } else {
          await AsyncStorage.setItem('userName', responseJson.name);
          await AsyncStorage.setItem('email', responseJson.email);
          await AsyncStorage.setItem('profilePicture', responseJson.profilePicture);
          dispatch(fetchUserToken(userToken, responseJson.name, responseJson.email, responseJson.profilePicture, false));
          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
          this.props.navigation.navigate(userToken ? 'App' : 'Auth');
        }
      } catch (error) {
        console.log(error);
        name = await AsyncStorage.getItem('userName');
        email = await AsyncStorage.getItem('email');
        profilePicture = await AsyncStorage.getItem('profilePicture');
        dispatch(fetchUserToken(userToken, name, email, profilePicture, false));
        this.props.navigation.navigate('App');
      }
    });
  }

_checkFacebookToken = () => {
  this.props.dispatch( async (dispatch) => {
  AccessToken.refreshCurrentAccessTokenAsync();
  const request = new GraphRequest(
    '/me',
    {
      parameters: {
        fields: {
          string: 'id,name,email,picture.width(100).height(100)',
        },
      },
    },
    (error, result) => {
      if (result) {
        const profile = result;
        AccessToken.getCurrentAccessToken()
        .then((data) => {
          let accessToken = "facebook." + data.accessToken;
          dispatch(fetchUserToken(accessToken, profile.name, profile.email, profile.picture.data.url, true));
  
          console.log(accessToken)
          // This will switch to the App screen or Auth screen and this loading
          // screen will be unmounted and thrown away.
          this.props.navigation.navigate(accessToken ? 'App' : 'Auth');
        })
        .catch(error => {
          console.log(error)
        })
      } else {
        console.log(error);
      }
    })
  new GraphRequestManager().addRequest(request).start();
  })
}

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) {
      this.props.navigation.navigate('Auth');
    } else if (userToken === "facebook") {
      AccessToken.getCurrentAccessToken()
      .then((tokenInfo) => {
        console.log(tokenInfo)
        if (!tokenInfo) {
          this.props.navigation.navigate('Auth');
        }
        this._checkFacebookToken(tokenInfo.accessToken);
      });
    } else {
      this._checkTokenAsync(userToken);
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <SafeAreaView style={{
        backgroundColor: '#D7E7ED', 
        width: Dimensions.get('window').width, 
        height: Dimensions.get('window').height,
        justifyContent: 'center'
        }}>
        <ActivityIndicator  size="large" color={"black"}/>
        <StatusBar barStyle="default" />
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(AuthLoadingScreen);