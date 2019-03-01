import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUserToken} from '../actions/UpdateUserToken';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _checkTokenAsync = async (userToken) => {
    this.props.dispatch( async (dispatch) => {
      try {
        let response = await fetch('http://localhost:8080/checkToken', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jwt: userToken,
          }),
        })
        let responseJson = await response.json();
        dispatch(fetchUserToken(userToken, responseJson.firstName, responseJson.lastName, responseJson.email));

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.
        this.props.navigation.navigate(userToken ? 'App' : 'Auth');
      } catch (error) {
        console.error(error);
      }
    });
}

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    this._checkTokenAsync(userToken);
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