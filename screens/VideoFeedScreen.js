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
import LocalVideoFeedScreen from './LocalVideoFeedScreen';
import GlobalVideoFeedScreen from './GlobalVideoFeedScreen';
import Icon from 'react-native-vector-icons/Ionicons'

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const LocationTabNavigator = createMaterialTopTabNavigator({
  Local: {
    screen: LocalVideoFeedScreen,
  },
  Global: {
    screen: GlobalVideoFeedScreen,
    tabBarLabel: 'Global'
  }
}, {
    initialRouteName: 'Local',
    // order: ['Settings', 'Home'],
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: 'red',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: '#f2f2f2',
        height: Dimensions.get('window').height*0.05,
      },
      tabStyle: {
        height: Dimensions.get('window').height*0.05,
        margin: 12,
      },
      labelStyle: {
        height: Dimensions.get('window').height*0.05,
        fontFamily: 'Avenir',
      },
      indicatorStyle: {
        backgroundColor: 'red',
      },
      safeAreaInset: { bottom: 'never', top: 'never' }
    }
  })

const LocationTabContainer = createAppContainer(LocationTabNavigator);

export default class VideoFeedScreen extends React.Component {
  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

