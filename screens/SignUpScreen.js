import React from 'react';
import {
    AsyncStorage,
    Dimensions,
    KeyboardAvoidingView,
    Image,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

import {fetchUserToken} from '../actions/UpdateUserToken';
import {FRONT_SERVICE_URL} from '../Constants';

class SignUpScreen extends React.Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
}

render() {
  return (
  <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#02b875', '#70C1B3', '#247BA0']} style={styles.linearGradient}>
    <SafeAreaView style={{flex:1}}>
    <View style={{height: Dimensions.get('window').height*0.5-215, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center'}}>
      <Image style={{height: Dimensions.get('window').height*0.11}} source={require('../assets/logo.png')} resizeMode={'contain'}/>
    </View>
    <View style={styles.container}>
      <View style={styles.formBox}>
        <Icon style={styles.formIcon} name="user" color={'#555'} size={25} />
        <TextInput placeholder="First Name" placeholderTextColor="#555" style={styles.formInput} onChangeText={(text) => this.setState({firstName: text})}/>
      </View>
      <View style={styles.formBox}>
        <Icon style={styles.formIcon} name="user" color={'#555'} size={25} />
        <TextInput placeholder="Last Name" placeholderTextColor="#555" style={styles.formInput} onChangeText={(text) => this.setState({lastName: text})}/>
      </View>
      <View style={styles.formBox}>
        <Icon style={styles.formIcon} name="envelope" color={'#555'} size={25} />
        <TextInput placeholder="Email" placeholderTextColor="#555" style={styles.formInput} onChangeText={(text) => this.setState({email: text})}/>
      </View>
      <View style={styles.formBox}>
        <Icon style={styles.formIcon} name="lock" color={'#555'} size={25} />
        <TextInput placeholder="Password"  secureTextEntry autoCorrect={false} placeholderTextColor="#555" style={styles.formInput} onChangeText={(text) => this.setState({password: text})}/>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={this._signUpAsync}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={[styles.signUpText, {color: 'black'}]} onPress={() => this.props.navigation.navigate('SignIn')}>Already have an account? </Text>
        <Text style={[styles.signUpText, {color: '#e74c3c'}]} onPress={() => this.props.navigation.navigate('SignIn')}>Sign In.</Text>
      </View>
    </View>
    </SafeAreaView>
  </LinearGradient>
  );
}

_signUpAsync = () => {
  this.props.dispatch( async (dispatch) => {
  try {
    let response = await fetch(FRONT_SERVICE_URL + '/auth/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName
      }),
    })
    let responseJson = await response.json();
    if (responseJson.jwt == "") {
      
    } else {
      await AsyncStorage.setItem('userToken', responseJson.jwt);
      await AsyncStorage.setItem('userName', responseJson.name);
      await AsyncStorage.setItem('email', responseJson.email);
      await AsyncStorage.setItem('profilePicture', "https://jackwill.me/images/mountains.jpg");
      dispatch(fetchUserToken(responseJson.jwt, responseJson.name, responseJson.email, "https://jackwill.me/images/mountains.jpg", false));
      this.props.navigation.navigate('App');
    }
  } catch (error) {
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
  },
  formText: {
    fontSize: 20,
    fontFamily: 'Avenir',
  },
  formInput: {
    flex: 1,
    fontSize: 15,
    height: 55,
    paddingLeft: 10,
  },
  submitButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 35,
    width: Dimensions.get('window').width*0.7,
    margin: 15,
    justifyContent: 'center',
    height: 55,
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
  },
  formBox: {
    backgroundColor: "rgba(215, 215, 225, 0.45)",
    borderRadius: 35,
    width: Dimensions.get('window').width*0.7,
    margin: 8,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
  },
  formIcon: {
    marginLeft: 20,
  }
})

const mapStateToProps = (state) => {
const {userToken} = state.main;
return {userToken};
}


export default connect(mapStateToProps)(SignUpScreen);
