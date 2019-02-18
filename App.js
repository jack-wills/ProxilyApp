import React from 'react';
import { 
  Dimensions,
  Platform, 
  ScrollView, 
  StatusBar, 
  StyleSheet, 
  View,
  SafeAreaView, } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createMaterialTopTabNavigator } from 'react-navigation'
import { createAppContainer } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
  
import VideoFeedScreen from './screens/VideoFeedScreen';
import CameraScreen from './screens/CameraScreen';
import SettingsScreen from './screens/SettingsScreen';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


const AppTabNavigator = createMaterialTopTabNavigator({
  Home: {
    screen: VideoFeedScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" color={tintColor} size={24} />
      )
    }
  },
  Settings: {
    screen: CameraScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-settings" color={tintColor} size={24} />
      )
    }
  }
}, {
    initialRouteName: 'Home',
    // order: ['Settings', 'Home'],
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
      activeTintColor: 'orange',
      inactiveTintColor: 'grey',
      style: {
        backgroundColor: '#f2f2f2',
        height: SCREEN_HEIGHT*0.09,
      },
      indicatorStyle: {
        height: 0
      },
      showIcon: true
    }
  })

const AppContainer = createAppContainer(AppTabNavigator);

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
      return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
      <AppContainer />
        
      </View>
      );
  }

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    flex: 1,
    backgroundColor: '#fff',
  },
});
