import React from 'react';
import {
    ActivityIndicator,
    AsyncStorage,
    Button,
    Dimensions,
    KeyboardAvoidingView,
    UserInput,
    StatusBar,
    SafeAreaView,
    StyleSheet,
    TextInput,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {fetchUserToken} from '../actions/UpdateUserToken';

import {FRONT_SERVICE_URL} from '../Constants';

class SignUpScreen extends React.Component {
  state = {
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
    firstName: '',
    lastName: '',
}

render() {
  return (
  <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#02b875', '#70C1B3', '#247BA0']} style={styles.linearGradient}>
    <KeyboardAvoidingView style={styles.container}>
        <Text style={{fontSize: 50, position: 'absolute', top: 50}}>Proxily</Text>
        <Text style={styles.formText}>First Name</Text>
        <TextInput style={styles.formInput} onChangeText={(text) => this.setState({firstName: text})}/>
        <Text style={styles.formText}>Last Name</Text>
        <TextInput style={styles.formInput} onChangeText={(text) => this.setState({lastName: text})}/>
        <Text style={styles.formText}>Email</Text>
        <TextInput style={styles.formInput} onChangeText={(text) => this.setState({email: text})}/>
        <Text style={styles.formText}>Username</Text>
        <TextInput style={styles.formInput} onChangeText={(text) => this.setState({username: text})}/>
        <Text style={styles.formText}>Password</Text>
        <TextInput style={styles.formInput} onChangeText={(text) => this.setState({password: text})}/>
        <Text style={styles.formText}>Password Again</Text>
        <TextInput style={styles.formInput} onChangeText={(text) => this.setState({passwordAgain: text})}/>
        <TouchableOpacity style={styles.submitButton} onPress={this._signUpAsync}>
            <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text style={[styles.signUpText, {color: 'black'}]} onPress={() => this.props.navigation.navigate('SignIn')}>Already have an account? </Text>
            <Text style={[styles.signUpText, {color: '#e74c3c'}]} onPress={() => this.props.navigation.navigate('SignIn')}>Sign In.</Text>
        </View>
    </KeyboardAvoidingView>
  </LinearGradient>
  );
}

_signUpAsync = () => {
  if (this.state.passwordAgain != this.state.password) {
    return;
  }
  this.props.dispatch( async (dispatch) => {
  try {
    let response = await fetch(FRONT_SERVICE_URL + '/register', {
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
      dispatch(fetchUserToken(responseJson.jwt, responseJson.name, responseJson.email, "file:///Users/Jack/Desktop/videoApp/assets/mountains.jpg", false));
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
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 50,
},
formText: {
    fontSize: 20,
    fontFamily: 'Avenir',
},
formInput: {
    width: Dimensions.get('window').width*0.58,
    textAlign: 'center',
    fontSize: 15,
    borderBottomWidth: 3,
    borderRadius: 4,
    margin: 10,
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


export default connect(mapStateToProps)(SignUpScreen);
