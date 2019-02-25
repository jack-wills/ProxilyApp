import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  UserInput,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class SignInScreen extends React.Component {
    state = {
        username: '',
        password: '',
    }
  
    render() {
      return (
      <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 1}} colors={['#02b875', '#70C1B3', '#247BA0']} style={styles.linearGradient}>
        <KeyboardAvoidingView style={styles.container}>
            <Text style={{fontSize: 50, position: 'absolute', top: 100}}>videoApp</Text>
            <Text style={styles.formText}>Username</Text>
            <TextInput style={styles.formInput} onChangeText={(text) => this.setState({username: text})}/>
            <Text style={styles.formText}>Password</Text>
            <TextInput style={styles.formInput} onChangeText={(text) => this.setState({password: text})}/>
            <TouchableOpacity style={styles.submitButton} onPress={this._signInAsync}>
                <Text style={styles.buttonText}>Sign In</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text style={[styles.signUpText, {color: 'black'}]} onPress={() => this.props.navigation.navigate('SignUp')}>Don't have an account? </Text>
            <Text style={[styles.signUpText, {color: '#ff1654'}]} onPress={() => this.props.navigation.navigate('SignUp')}>Sign Up.</Text>
            </View>
        </KeyboardAvoidingView>
      </LinearGradient>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    };
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
        backgroundColor: '#ff1654',
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
  