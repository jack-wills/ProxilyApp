import React from 'react';
import {
  Button,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
} from 'react-native';

export default class SubmitTextScreen extends React.Component {
  render() {
    return (
        <SafeAreaView>
        <Text>This is Submit text</Text>
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
});