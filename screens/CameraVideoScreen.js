import React, {Component} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  StyleSheet, 
  Text, 
  View} from 'react-native';
  import { RNCamera } from 'react-native-camera';
  import {connect} from 'react-redux';

class CameraVideoScreen extends React.Component {
  render() {
    return (
      <SafeAreaView>
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          flashMode={RNCamera.Constants.FlashMode.on}
          permissionDialogTitle={'Permission to use camera'}
          permissionDialogMessage={'We need your permission to use your camera phone'}
          onGoogleVisionBarcodesDetected={({ barcodes }) => {
            console.log(barcodes);
          }}
        />
        <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.record.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> RECORD </Text>
          </TouchableOpacity>
        </View>
        </View>
      </SafeAreaView>
    );
  }
  record = async function() {
    if (this.camera) {
      const options = { quality: RNCamera.Constants.VideoQuality["720p"] };
      const data = await this.camera.recordAsync(options);
      console.log(data.uri);
    }
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(CameraVideoScreen);