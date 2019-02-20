import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createMaterialTopTabNavigator } from 'react-navigation';
import { createAppContainer } from 'react-navigation'
import PopularVideoFeedScreen from './PopularVideoFeedScreen';
import NewVideoFeedScreen from './NewVideoFeedScreen';
import Icon from 'react-native-vector-icons/Ionicons'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const LocationTabNavigator = createMaterialTopTabNavigator({
  Popular: {
    screen: PopularVideoFeedScreen,
  },
  New: {
    screen: NewVideoFeedScreen,
    tabBarLabel: 'New'
  }
}, {
    initialRouteName: 'Popular',
    // order: ['Settings', 'Home'],
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: '#fff',
        height: Dimensions.get('window').height*0.06,
      },
      tabStyle: {
        height: Dimensions.get('window').height*0.05,
        margin: 16,
        fontFamily: 'Avenir',
      },
      labelStyle: {
        height: Dimensions.get('window').height*0.05,
      },
      indicatorStyle: {
        backgroundColor: 'red',
      },
    }
  })

const LocationTabContainer = createAppContainer(LocationTabNavigator);

export default class VideoFeedScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F2B45B'}}>
        <Text style={styles.topBar}>Title</Text>
        <LocationTabContainer />
        </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    height: SCREEN_HEIGHT*0.8,
  },
  topBar: {
    fontSize: 20,
    backgroundColor: '#F2B45B',
    fontFamily: 'Avenir',
    textAlign: "left",
    padding: 10,
    paddingLeft: 20,
  },
});

