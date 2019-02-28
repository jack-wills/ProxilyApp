import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

export default class SubmitTextScreen extends React.Component {
    state = {
        text: ''
    }

    _submitText = () => {
        console.log(this.state.text);
    };
      
    render() {
        return (
        <SafeAreaView style={{backgroundColor: '#02b875', flex: 1}}>
            <View style={{flexDirection:'row', 
                        backgroundColor: '#02b875',
                        shadowRadius: 4,
                        shadowColor: 'grey',
                        shadowOffset: {height: 6, width: 0},
                        shadowOpacity: 0.3,
                        zIndex: 1}}>
                <Text style={styles.topBar}>Title</Text>
            </View>
        <KeyboardAvoidingView style={styles.container}>
                <TextInput multiline={true} placeholder="Enter Text.." placeholderTextColor="grey" style={styles.formInput} onChangeText={(text) => this.setState({text: text})}/>
                <TouchableOpacity style={styles.submitButton} onPress={this._submitText}>
                    <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
        </KeyboardAvoidingView>
        </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  topBar: {
    flex: 0,
    fontSize: 20,
    fontFamily: 'Avenir',
    textAlign: "left",
    padding: 10,
    paddingLeft: 20,
  },
  formInput: {
    width: Dimensions.get('window').width*0.8,
    height: Dimensions.get('window').height*0.3,
    textAlign: 'left',
    textAlignVertical: 'top',
    fontSize: 14,
    fontFamily: 'Avenir',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'grey',
    margin: 15,
    padding: 10,
    paddingTop: 13,
    backgroundColor: '#f3fAfC',
    color: '#222'
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
});