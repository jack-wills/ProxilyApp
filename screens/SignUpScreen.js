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
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default class SignInScreen extends React.Component {
    state = {
        username: '',
        password: '',
    }
  
    render() {
      return (
        <KeyboardAvoidingView style={styles.container}>
            <Icon style={{position: 'absolute', top: 40, left: 20}} name="ios-arrow-back" color={'grey'} size={34} onPress={() => this.props.navigation.goBack()}/>
            <TextInput style={styles.textInput} placeholder="Username" onChangeText={(text) => this.setState({username: text})}/>
            <TextInput style={styles.textInput} placeholder="Password" onChangeText={(text) => this.setState({password: text})}/>
            <Text>{this.state.username}</Text>
            <Button title="Sign up!" onPress={this._signInAsync} />
        </KeyboardAvoidingView>
      );
    }
  
    _signInAsync = async () => {
      await AsyncStorage.setItem('userToken', 'abc');
      this.props.navigation.navigate('App');
    };
  }


const styles = StyleSheet.create({
    container: {
      backgroundColor: '#F4C484',
      flex: 1,
      height: Dimensions.get('window').height,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
        width: Dimensions.get('window').width*0.65,
        textAlign: 'center',
        fontSize: 25,
        fontFamily: 'Avenir',
        borderBottomWidth: 3,
        borderRadius: 4,
        margin: 15,
    }
  })