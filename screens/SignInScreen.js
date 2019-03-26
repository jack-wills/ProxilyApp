import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  UserInput,
  StatusBar,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {fetchUserToken} from '../actions/UpdateUserToken';

import { LoginManager } from 'react-native-fbsdk'
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import {FRONT_SERVICE_URL} from '../Constants';

class SignInScreen extends React.Component {
    state = {
        email: '',
        password: '',
    }

    facebookLoginAPI(callback) {
        LoginManager.logInWithReadPermissions(['public_profile', 'user_friends', 'email'])
        .then((FBloginResult) => {
          if (FBloginResult.isCancelled) {
            throw new Error('Login cancelled');
          }
    
          if (FBloginResult.deniedPermissions) {
            throw new Error('We need the requested permissions');
          }
    
          AccessToken.getCurrentAccessToken()
          .then((data) => {
            callback(data.accessToken);
          })
          .catch(error => {
            console.log(error)
          })
        })
        .catch((error) => {
          console.log(error);
        });
    }

    async registerFacebookAccount(userToken) {
    this.props.dispatch( async (dispatch) => {
      try {
        let response = await fetch(FRONT_SERVICE_URL + '/registerFacebookAccount', {
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
        if (responseJson.hasOwnProperty('error')) {
          console.error(responseJson.error);
        }
      } catch (error) {
        console.error(error);
      }
    });
  }

    handleFacebookLogin = async () => {
      this.props.dispatch( async (dispatch) => {
      this.facebookLoginAPI(async (accessToken) => {
        this.registerFacebookAccount(accessToken);
        const request = new GraphRequest(
          '/me',
          {
            parameters: {
              fields: {
                string: 'id,name,email,picture.width(100).height(100)',
              },
            },
          },
          async (error, result) => {
            if (result) {
              const profile = result
              console.log(profile);
              await AsyncStorage.setItem('userToken', accessToken);
              await AsyncStorage.setItem('tokenProvider', "facebook");
              dispatch(fetchUserToken(accessToken, profile.name, profile.email, profile.picture.data.url, true));
              this.props.navigation.navigate('App');
            } else {
              console.log(error);
            }
          }
        )
  
        new GraphRequestManager().addRequest(request).start();
      });
    });
    }
  
    render() {
      return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#02b875', '#70C1B3', '#247BA0']} style={styles.linearGradient}>
        <SafeAreaView style={{flex:1}}>
        <View style={{flex: 0.3, justifyContent: 'center', alignItems: 'center'}}>
          <Image style={{height: Dimensions.get('window').height*0.1}} source={require('../assets/logo7.png')} resizeMode={'contain'}/>
        </View>
        <KeyboardAvoidingView style={styles.container}>
            <Text style={styles.formText}>Email</Text>
            <TextInput style={styles.formInput} onChangeText={(text) => this.setState({email: text})}/>
            <Text style={styles.formText}>Password</Text>
            <TextInput style={styles.formInput} onChangeText={(text) => this.setState({password: text})}/>
            <TouchableOpacity style={styles.submitButton} onPress={this._signInAsync}>
                <Text style={styles.buttonText}>Sign in</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.handleFacebookLogin} style={[styles.submitButton, {backgroundColor: '#4267b2', fontFamily: 'Helvetica Neue'}]}>
                <Text style={styles.buttonText}>Sign in with Facebook</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text style={[styles.signUpText, {color: 'black'}]} onPress={() => this.props.navigation.navigate('SignUp')}>Don't have an account? </Text>
            <Text style={[styles.signUpText, {color: '#e74c3c'}]} onPress={() => this.props.navigation.navigate('SignUp')}>Sign Up.</Text>
            </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
      </LinearGradient>
      );
    }
  
    _signInAsync = () => {
      this.props.dispatch( async (dispatch) => {
      try {
        let response = await fetch(FRONT_SERVICE_URL + '/signin', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: "jackw53519@gmail.co.uk",
            password: "test123",
          }),
        })
        let responseJson = await response.json();
        if (responseJson.jwt == "") {
          
        } else {
          await AsyncStorage.setItem('userToken', responseJson.jwt);
          await AsyncStorage.setItem('tokenProvider', "proxily");
          dispatch(fetchUserToken(responseJson.jwt, responseJson.name, responseJson.email, responseJson.profilePicture, false));
          this.props.navigation.navigate('App');
        }
      } catch (error) {
        console.error(error);
      }
    })
  }
  }

const styles = StyleSheet.create({
    linearGradient: {
      flex: 1,
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
    container: {
      backgroundColor: 'transparent',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flex: 0.5,
    },
    formText: {
        fontSize: 25,
        fontFamily: 'Avenir',
    },
    formInput: {
        width: Dimensions.get('window').width*0.58,
        textAlign: 'center',
        fontSize: 20,
        borderBottomWidth: 3,
        borderRadius: 4,
        margin: 15,
    },
    submitButton: {
        backgroundColor: '#e74c3c',
        borderRadius: 35,
        width: Dimensions.get('window').width*0.7,
        margin: 15,
    },
    buttonText: {
        fontFamily: 'Avenir',
        color: 'white',
        fontSize: 20,
        padding: 13,
        textAlign: 'center',
    },
    signUpText: {
        fontFamily: 'Avenir',
        fontSize: 15,
        textAlign: 'center',
    }
  })

  const mapStateToProps = (state) => {
    const {userToken} = state.main;
    return {userToken};
  }
  
  export default connect(mapStateToProps)(SignInScreen);
  