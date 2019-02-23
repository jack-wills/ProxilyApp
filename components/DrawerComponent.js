import React from 'react'
import { AsyncStorage, Dimensions, StyleSheet, SafeAreaView, Text, TouchableHighlight, View, Image } from 'react-native'

export default class DrawerComponent extends React.Component {

    async signOut(navigation) {
        try {
            console.log(navigation)
            await AsyncStorage.removeItem('userToken');
        } catch(error) {
            console.log('error: ', error);
        }
   }

  render() {
    const navigation = this.props.navigation
    return (
      <SafeAreaView style={{backgroundColor: '#87B7CB', flex:1}}>
      <View style={styles.drawerHeader}>
          <Image
            style={styles.drawerImage}
            source={require('../assets/mountains.jpg')} />
          <Text style={styles.drawerHeaderText}>UserName</Text>
      </View>
      <View style={styles.container}>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => {this.signOut();
                                                                        navigation.navigate('AuthLoading');}}>
          <Text
            style={styles.drawerItem}>
            Sign Out
          </Text>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
        <TouchableHighlight underlayColor={'lightgrey'} onPress={() => navigation.navigate('screen2')}>
          <Text
            style={styles.drawerItem}>
            Screen 2
          </Text>
        </TouchableHighlight>
        <View style={styles.lineBreak}/>
      </View>
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: Dimensions.get('window').height*0.9,
    flex: 1,
  },
  drawerItem: {
    fontSize: 18,
    fontFamily: 'Avenir',
    color: 'black',
    height: 50,
    paddingLeft: 10,
    paddingTop: 13,
  },
  drawerHeader: {
    height: Dimensions.get('window').height*0.1,
    flexDirection: "row",
    alignItems: 'center',
  },
  drawerHeaderText: {
    fontSize: 18,
    fontFamily: 'Avenir',
    paddingLeft: 15,
  },
  drawerImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
    marginLeft: 15,
  },
  lineBreak: {
    alignSelf: 'center',
    backgroundColor: 'black', 
    height: 1,
    width: Dimensions.get('window').width*0.7,
  }
})