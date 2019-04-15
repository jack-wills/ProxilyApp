import React from 'react';
import { 
  Dimensions,
  Button,
  Image, 
  StyleSheet,
  PixelRatio, 
  View,
  TouchableOpacity,
  Text,
  SafeAreaView, } from 'react-native';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import { createMaterialTopTabNavigator, createStackNavigator, createSwitchNavigator, createDrawerNavigator } from 'react-navigation'
import { createAppContainer } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
  
import SavedLocationsScreen from './screens/SavedLocationsScreen';
import SavedLocationsAddScreen from './screens/SavedLocationsAddScreen';
import AboutScreen from './screens/AboutScreen';
import AccountScreen from './screens/AccountScreen';
import MyPostsScreen from './screens/MyPostsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import HelpScreen from './screens/HelpScreen';
import PopularVideoFeedScreen from './screens/PopularVideoFeedScreen';
import NewVideoFeedScreen from './screens/NewVideoFeedScreen';
import ExpandedFeedItemScreen from './screens/ExpandedFeedItemScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import AuthLoadingScreen from './screens/AuthLoadingScreen';
import DrawerComponent from './components/DrawerComponent.js';
import FooterTabs from './components/CustomFooter';
import SubmitTextScreen from './screens/SubmitTextScreen'
import CameraVideoScreen from './screens/CameraVideoScreen'
import CameraPictureScreen from './screens/CameraPictureScreen'
import MainReducer from './reducers/MainReducer'
import PictureReviewScreen from './screens/PictureReviewScreen';
import VideoReviewScreen from './screens/VideoReviewScreen';
import {DEBUG_MODE} from './Constants';

const store = createStore(MainReducer, applyMiddleware(thunk, logger));

function getTabBarHeight () {
  let height = Dimensions.get('window').height*0.07;
  if (height > 50) {
    return 50;
  }
  return height;
}
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
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: '#FF1654',
      inactiveTintColor: 'black',
      style: {
        backgroundColor: '#A4D7CE',
        shadowRadius: 4,
        shadowColor: 'grey',
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 1.0,
      },
      labelStyle: {
        fontSize: 10 + getTabBarHeight()/10,
      },
      tabStyle: {
        fontFamily: 'Avenir',
        height: getTabBarHeight(),
      },
      indicatorStyle: {
        backgroundColor: '#FF1654',
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
      <SafeAreaView style={{backgroundColor: '#02b875', flex: 1}}>
      <View style={{flexDirection:'row', 
                    backgroundColor: '#02b875',
                    shadowRadius: 4,
                    shadowColor: 'grey',
                    shadowOffset: {height: 6, width: 0},
                    shadowOpacity: 0.3,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    zIndex: 1, height: 42}}>
        <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}>
          <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginLeft: 15, width: 40, height: 40 }}>
            <Icon style={{paddingTop: 2, paddingRight: 20}} name='ios-menu' color='white' size={32}/>
          </View>
        </TouchableOpacity>
        <Image resizeMode={'contain'} source={require('./assets/logo4.png')} style={{flex:1, height: 32, marginTop: 5}}/>
        <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginRight: 15, width: 40, height: 40 }}>
        </View>
          
      </View>
      <ExpandedStackNavigator navigation={this.props.navigation} screenProps={{ latitude: "51.923187", longitude: "-0.226379"}}/>
    </SafeAreaView>
    );
  }
}


class SavedLocationsFeedScreen extends React.Component {
  static router = ExpandedStackNavigator.router;

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#02b875', flex: 1}}>
      <View style={{flexDirection:'row', 
                    backgroundColor: '#02b875',
                    shadowRadius: 4,
                    shadowColor: 'grey',
                    shadowOffset: {height: 6, width: 0},
                    shadowOpacity: 0.3,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    zIndex: 1, height: 42,
                    width: Dimensions.get('window').width}}>
        <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
          <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginLeft: 15, width: 40, height: 40 }}>
            <Icon style={{paddingTop: 2, paddingRight: 20}} name='ios-arrow-back' color='white' size={32}/>
          </View>
        </TouchableOpacity>
        <Text style={{flex:1, height: 38, textAlign: 'center', color: 'white', fontFamily: 'Avenir', fontSize: 30, fontWeight: 'bold'}}>{this.props.navigation.state.params.name}</Text>
        <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginRight: 15, width: 40, height: 40 }}>
        </View>
      </View>
      <ExpandedStackNavigator navigation={this.props.navigation} screenProps={{ latitude: this.props.navigation.state.params.latitude, longitude: this.props.navigation.state.params.longitude}}/>
    </SafeAreaView>
    );
  }
}

const SavedLocationsStackNavigator = createStackNavigator({
  SavedLocations: {
    screen: SavedLocationsScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  },
  SavedLocationsFeed: {
    screen: SavedLocationsFeedScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  },
  SavedLocationsAdd: {
    screen: SavedLocationsAddScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
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
SavedLocationsStackNavigator.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;

  let routeName = navigation.state.routes[navigation.state.index].routeName

  if ( routeName == 'SavedLocationsAdd' ) {
      tabBarVisible = false
  }

  return {
      tabBarVisible,
  }
}

const AuthStackNavigator = createStackNavigator({
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  },
  SignIn: {
    screen: SignInScreen,

    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  }},
  {
    initialRouteName: 'SignIn',
  }
);

const SubmitImageStackNavigator = createStackNavigator({
  CameraPicture: {
    screen: CameraPictureScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  },
  PictureReview: {
    screen: PictureReviewScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  }},
  {
    initialRouteName: 'CameraPicture',
    swipeEnabled: false,
    animationEnabled: false,
  }
);

const SubmitVideoStackNavigator = createStackNavigator({
  CameraVideo: {
    screen: CameraVideoScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  },
  VideoReview: {
    screen: VideoReviewScreen,
    navigationOptions: ({ navigation }) => ({
      headerStyle: { 
        marginTop: -40,
        backgroundColor: 'white',
      },
      header: null,
    })
  }},
  {
    initialRouteName: 'CameraVideo',
    swipeEnabled: false,
    animationEnabled: false,
  }
);

const AppTabNavigator = createMaterialTopTabNavigator({
  Home: FeedScreen,
  SavedLocations:  SavedLocationsStackNavigator,
  CameraPicture:  {
    screen: SubmitImageStackNavigator,
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: false,
    })
  },
  CameraVideo:  {
    screen: SubmitVideoStackNavigator,
    navigationOptions: ({ navigation }) => ({
      tabBarVisible: false,
    })
  },
  SubmitText:  SubmitTextScreen,
  Account: AccountScreen,
  MyPosts: MyPostsScreen,
  Notifications: NotificationsScreen,
  Privacy: PrivacyScreen,
  Help: HelpScreen,
  About: AboutScreen,
}, {
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    tabBarComponent: (props) => (
      <FooterTabs{...props} />
    ),
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: '#e74c3c',
      showIcon: true
    }
  })


  const SettingsDrawerNavigator = createDrawerNavigator({
    Feed: AppTabNavigator,
    Account: AccountScreen,
    MyPosts: MyPostsScreen,
    Notifications: NotificationsScreen,
    Privacy: PrivacyScreen,
    Help: HelpScreen,
    About: AboutScreen,
  }, {
    initialRouteName: 'Feed',
    drawerPosition: 'left',
    contentComponent: DrawerComponent,
    drawerOpenRoute: 'DrawerOpen',
    drawerCloseRoute: 'DrawerClose',
    drawerToggleRoute: 'DrawerToggle',
  
  });

const AppContainer = createAppContainer(createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: SettingsDrawerNavigator,
    Auth: AuthStackNavigator,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));

export default class App extends React.Component {

  componentWillMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.MEDIUM_ACCURACY,
      distanceFilter: 100,
      debug: DEBUG_MODE,
      startOnBoot: false,
      stopOnTerminate: true,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });

    BackgroundGeolocation.on('location', (location) => {
      console.log(location)
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask
        BackgroundGeolocation.endTask(taskKey);
      });
    });
  }

  componentWillUnmount() {
    BackgroundGeolocation.removeAllListeners();
  }
  render() {
      return (
      
      <Provider store={store}>
      <AppContainer />
        
      </Provider>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    flex: 1,
    alignContent: "center",
  },
  topBar: {
    flex: 0,
    width: 10,
    height: 10,
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
  }
});
