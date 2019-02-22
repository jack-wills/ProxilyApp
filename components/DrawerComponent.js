import React from 'react'
import { AsyncStorage, StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Image } from 'react-native'

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
      <SafeAreaView>
      <View style={styles.drawerHeader}>
          <Image
            style={styles.drawerImage}
            source={require('../assets/mountains.jpg')} />
          <Text>UserName</Text>
      </View>
      <View style={styles.container}>
        <TouchableOpacity>
        <Text
          onPress={() => {this.signOut();
            navigation.navigate('AuthLoading');}}
          style={styles.uglyDrawerItem}>
          Sign Out
        </Text>
        </TouchableOpacity>
        <Text
          onPress={() => navigation.navigate('screen2')}
          style={styles.uglyDrawerItem}>
          Screen 2
        </Text>
      </View>
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  uglyDrawerItem: {
    backgroundColor: '#f6f6f6',
    fontSize: 18,
    fontFamily: 'Avenir',
    color: 'black',
    height: 50,
    paddingLeft: 10,
    paddingTop: 13,
    marginTop: 10,
  },
  drawerHeader: {
    height: 60,
    backgroundColor: 'white',
    marginTop: 15,
    flexDirection: "row",
  },
  drawerImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  }
})