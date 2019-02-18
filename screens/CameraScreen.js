import React, {Component} from 'react';
import {
  SafeAreaView,
  Platform, 
  StyleSheet, 
  Text, 
  View} from 'react-native';

export default class CameraScreen extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  }
});