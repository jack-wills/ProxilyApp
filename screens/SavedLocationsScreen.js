import React from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class SavedLocationsScreen extends React.Component {
  render() {
    return (
        <Text>This is Saved locations</Text>
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
