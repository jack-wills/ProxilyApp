import React from 'react';
import { 
  Dimensions,
  Button,
  Image, 
  StyleSheet, 
  View,
  TouchableOpacity,
  Text,
  SafeAreaView, } from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import { createMaterialTopTabNavigator, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import { createAppContainer } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
  
import CameraScreen from './screens/CameraScreen';
import SettingsScreen from './screens/SettingsScreen';
import PopularVideoFeedScreen from './screens/PopularVideoFeedScreen';
import NewVideoFeedScreen from './screens/NewVideoFeedScreen';
import ExpandedFeedItemScreen from './screens/ExpandedFeedItemScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import DrawerComponent from './components/DrawerComponent.js';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const FeedTabNavigator = createMaterialTopTabNavigator({
  Popular: {
    screen: PopularVideoFeedScreen,
  },
  New: {
    screen: NewVideoFeedScreen,
    tabBarLabel: 'New'
  }
}, {
    initialRouteName: 'Popular',
    //tabBarComponent: TabBar,
    // order: ['Settings', 'Home'],
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: 'black',
      inactiveTintColor: 'black',
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

  const ExpandedStackNavigator = createStackNavigator({
    Feed: {
      screen: FeedTabNavigator,
      navigationOptions: ({ navigation }) => ({
        headerStyle: { 
          marginTop: -40,
          backgroundColor: 'white',
        },
        header: null,
      })
    },
    Expanded: {
      screen: ExpandedFeedItemScreen,
      navigationOptions: ({ navigation }) => ({
        headerStyle: { 
          marginTop: -40,
          backgroundColor: 'white',
        },
        headerLeft : (
          <TouchableOpacity onPress={() => { navigation.goBack() }}>
              <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginLeft: 15, width: 40, height: 40 }}>
                <Icon name="ios-arrow-back" color={'grey'} size={34} />
              </View>
          </TouchableOpacity>
      ),
      })
    }
  }, {
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,
      },
        screenInterpolator: (props) => {
          const translateX = 0
          const translateY = 0

          return {
              transform: [{translateX}, {translateY}]
          }
        } 
    }),
  });

class FeedScreen extends React.Component {
  static router = ExpandedStackNavigator.router;

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#F2B45B', flex: 1}}>
      <View style={{flexDirection:'row'}}>
          <Icon style={{paddingTop: 7, paddingLeft: 20}} name='ios-menu' color='black' size={32} onPress={this.props.navigation.openDrawer}/>
          <Text style={styles.topBar}>Title</Text>
      </View>
      <ExpandedStackNavigator navigation={this.props.navigation} />
    </SafeAreaView>
    );
  }
}


const AuthStackNavigator = createStackNavigator({
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: {
      title: "Sign Up"
    }
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: {
      title: "Sign In"
    }
  }},
  {
    initialRouteName: 'SignIn',
  }
);

const SettingsDrawerNavigator = createDrawerNavigator({
  Home: FeedScreen,
  //AuthLoading: CameraScreen,
  screen2: CameraScreen,
}, {
  initialRouteName: 'Home',
  drawerPosition: 'left',
  contentComponent: DrawerComponent,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',

});

const AppTabNavigator = createMaterialTopTabNavigator({
  Home: {
    screen: SettingsDrawerNavigator,
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


const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppTabNavigator,
    Auth: AuthStackNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

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
    alignContent: "center",
  },
  topBar: {
    flex: 0,
    fontSize: 20,
    backgroundColor: '#F2B45B',
    fontFamily: 'Avenir',
    textAlign: "left",
    padding: 10,
    paddingLeft: 20,
  },
  topNavBar: {
    backgroundColor: 'white',
    alignContent: "space-between",
    flexDirection: "row",
  },
  button: {
    width: Dimensions.get('window').width*0.5,
    height: Dimensions.get('window').height*0.06,
  },
  buttonText: {
    width: Dimensions.get('window').width*0.5,
    textAlign: 'center',
    paddingTop: 16,
    fontFamily: 'Avenir',
    fontSize: 15,
  },
  indicator: {
    height: 1,
    backgroundColor: 'red',
    marginTop: (Dimensions.get('window').height*0.02)-6,
  }
});
