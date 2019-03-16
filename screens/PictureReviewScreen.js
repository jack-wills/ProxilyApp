import React, {Component} from 'react';
import {
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  Image, 
  Text, 
  View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {connect} from 'react-redux';

class PictureReviewScreen extends React.Component {
  state = {
    
  }

  submitImage = async () => {
    let uploadUri = ""
    await fetch(FRONT_SERVICE_URL + '/uploadItem', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: "51.923147",
          longitude: "-0.226299",
          jwt: this.props.userToken,
          mediaType: "image",
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('error')) {
          console.error(responseJson.error);
        } else {
          uploadUri = responseJson;
          this.setState({comments: responseJson})
        }
      })
      .catch((error) => {
        console.error(error);
      });
      file = {uri: this.props.navigation.state.params.imageUri, type: "string", name: "string"};
      const xhr = new XMLHttpRequest();
      xhr.upload.addEventListener('progress', (e) => {
        // handle notifications about upload progress: e.loaded / e.total
        console.log('progress');
        console.log(e);
        
      }, false);
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // Successfully uploaded the file.
            console.log('successfully uploaded presignedurl');
            console.log(xhr);
            
          } else {
            // The file could not be uploaded.
            console.log('failed to upload presignedurl');
            console.log(xhr);
            
          }
        }
      };
      xhr.open('PUT', uploadUri);
      xhr.setRequestHeader('X-Amz-ACL', 'public-read');
      // for text file: text/plain, for binary file: application/octet-stream
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
  }
  /*
        */
  
  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.iconContainer, {bottom: Dimensions.get('window').height-80, left: 20}]}>
            <TouchableOpacity style={styles.icon} onPress={() => { this.props.navigation.goBack() }}>
            <Icon name="close" size={40} color="white"/>
            </TouchableOpacity>
        </View>
        <Image source={{uri: this.props.navigation.state.params.imageUri}} style={{
            marginTop: 125,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width,}} 
            resizeMode="contain"/>

        <SafeAreaView style={{flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#D7E7ED',}}>
        <View style={[styles.submitButton, {bottom: 130}]}>
            <TouchableOpacity style={styles.submitButton} onPress={this.submitImage}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    //overflow: 'hidden',
    backgroundColor: '#D7E7ED'
  },
  iconContainer: {
    position: 'absolute'
  },
  submitButton: {
      backgroundColor: '#e74c3c',
      borderRadius: 35,
      width: Dimensions.get('window').width*0.7,
      position: 'absolute'
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

export default connect(mapStateToProps)(PictureReviewScreen);