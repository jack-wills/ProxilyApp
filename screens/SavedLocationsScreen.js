import React from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default class SavedLocationsScreen extends React.Component {
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
        <View style={styles.container}>
        <Text>This is Saved locations</Text>
            </View>
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
});
