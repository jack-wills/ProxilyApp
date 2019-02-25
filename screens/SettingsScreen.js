import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class SettingsScreen extends React.Component {
  render() {
    return (
      <Text style={styles.container}>This is Settings</Text>
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
