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
import Modal from 'react-native-modal';

import { LoginManager } from 'react-native-fbsdk'
import { LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import {FRONT_SERVICE_URL, DEBUG_MODE} from '../Constants';

class SignInScreen extends React.Component {
    state = {
        email: '',
        password: '',
        error: "",
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
      });
    }

    handleFacebookLogin = async () => {
      this.props.dispatch( async (dispatch) => {
      this.facebookLoginAPI(async (userToken) => {
        try {
          let response = await fetch(FRONT_SERVICE_URL + '/auth/signinFacebook', {
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
            this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
            console.error(responseJson.error);
          } else {
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
                  await AsyncStorage.setItem('userToken', "facebook");
                  await AsyncStorage.setItem('userName', profile.name);
                  await AsyncStorage.setItem('email', profile.email);
                  await AsyncStorage.setItem('profilePicture', profile.picture.data.url);
                  dispatch(fetchUserToken("facebook." + userToken, profile.name, profile.email, profile.picture.data.url, true));
                  this.props.navigation.navigate('App');
                } else {
                  console.log(error);
                }
              }
            )
            new GraphRequestManager().addRequest(request).start();
          }
        } catch (error) {
          this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
          console.log(error);
        }
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
          <Modal
              isVisible={this.state.error != ""}
              onBackdropPress={() => this.setState({ error: "" })}>
              <View style={{alignSelf: 'center',
                  justifySelf: 'center',
                  width: Dimensions.get('window').width*0.6,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  shadowRadius: 4,
                  shadowColor: 'grey',
                  shadowOffset: {height: 2, width: 0},
                  shadowOpacity: 0.25,
                  overflow: 'hidden',
                  padding: 15,
              }}>
              <Text style={{fontFamily: 'Avenir'}}>{this.state.error}</Text>
              </View>
          </Modal>
        </SafeAreaView>
      </LinearGradient>
      );
    }
  
    _signInAsync = () => {
      this.props.dispatch( async (dispatch) => {
      try {
        let response = await fetch(FRONT_SERVICE_URL + '/auth/signin', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: DEBUG_MODE ? "jackw53519@gmail.co.uk" : this.state.email,
            password: DEBUG_MODE ? "test123" : this.state.password,
          }),
        })
        let responseJson = await response.json();
        if (responseJson.hasOwnProperty('error')) {
          this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
        } else if (responseJson.jwt === "") {
          this.setState({error: "User token is empty"});
        } else {
          await AsyncStorage.setItem('userToken', responseJson.jwt);
          await AsyncStorage.setItem('userName', responseJson.name);
          await AsyncStorage.setItem('email', responseJson.email);
          await AsyncStorage.setItem('profilePicture', responseJson.profilePicture);
          dispatch(fetchUserToken(responseJson.jwt, responseJson.name, responseJson.email, responseJson.profilePicture, false));
          this.props.navigation.navigate('App');
        }
      } catch (error) {
        this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
        console.log(error);
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
  