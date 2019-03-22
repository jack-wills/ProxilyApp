import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import { AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import {fetchUserToken} from '../actions/UpdateUserToken';

import {FRONT_SERVICE_URL} from '../Constants';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _checkTokenAsync = async (userToken) => {
    this.props.dispatch( async (dispatch) => {
      try {
        let response = await fetch(FRONT_SERVICE_URL + '/checkToken', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token: userToken,
          }),
        })
        let responseJson = await response.json();
        dispatch(fetchUserToken(userToken, responseJson.name, responseJson.email, responseJson.profilePicture, false));

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      } catch (error) {
        console.error(error);
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
          let accessToken = data.accessToken;
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
    const tokenProvider = await AsyncStorage.getItem('tokenProvider');
    if (tokenProvider === "facebook") {
      AccessToken.getCurrentAccessToken()
      .then((tokenInfo) => {
        console.log(tokenInfo)
        if (!tokenInfo) {
          this.props.navigation.navigate('Auth');
        }
        this._checkFacebookToken(tokenInfo.accessToken);
      });
    } else {
      const userToken = await AsyncStorage.getItem('userToken');
      this._checkTokenAsync(userToken);
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}


export default connect(mapStateToProps)(AuthLoadingScreen);