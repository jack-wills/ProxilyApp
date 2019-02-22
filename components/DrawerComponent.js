import React from 'react'
import { AsyncStorage, Dimensions, StyleSheet, SafeAreaView, Text, TouchableOpacity, View, Image } from 'react-native'

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
          <Text>UserName</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.lineBreak}/>
        <TouchableOpacity>
          <Text
            onPress={() => {this.signOut();
              navigation.navigate('AuthLoading');}}
            style={styles.drawerItem}>
            Sign Out
          </Text>
        <View style={styles.lineBreak}/>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            onPress={() => navigation.navigate('screen2')}
            style={styles.drawerItem}>
            Screen 2
          </Text>
        </TouchableOpacity>
        <View style={styles.lineBreak}/>
      </View>
    </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    height: Dimensions.get('window').height*0.9,
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
    backgroundColor: '#87B7CB',
    paddingTop: 15,
    flexDirection: "row",
  },
  drawerImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  lineBreak: {
    backgroundColor: 'black', 
    height: 1,
  }
})