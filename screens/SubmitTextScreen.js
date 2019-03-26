import React from 'react';
import {
  Button,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';

import {FRONT_SERVICE_URL} from '../Constants';

class SubmitTextScreen extends React.Component {
    state = {
        text: ''
    }

    _submitText = () => {
      fetch(FRONT_SERVICE_URL + '/uploadItem', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: "51.923187",
          longitude: "-0.226379",
          jwt: this.props.userToken,
          mediaType: "text",
          media: this.state.text,
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.hasOwnProperty("error")) {
          console.log("Couldn't get feed data because: " + responseJson.error)
        } else if (responseJson.hasOwnProperty("success") && responseJson.success) {
          this.props.navigation.navigate('New');
        }
      })
      .catch((error) => {
        console.error(error);
      });
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
                        justifyContent: 'center',
                        flexDirection: 'row',
                        zIndex: 1, height: 42}}>
            <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}>
              <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginLeft: 15, width: 40, height: 40 }}>
                <Icon style={{paddingTop: 2, paddingRight: 20}} name='ios-menu' color='white' size={32}/>
              </View>
            </TouchableOpacity>
            <Image resizeMode={'contain'} source={require('../assets/logo4.png')} style={{flex:1, height: 32, marginTop: 5}}/>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginRight: 15, width: 40, height: 40 }}>
            </View>
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
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#D7E7ED',
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
    width: Dimensions.get('window').width,
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
    backgroundColor: '#DEEEF4',
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

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(SubmitTextScreen);