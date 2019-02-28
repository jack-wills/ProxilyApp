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
  
import SavedLocationsScreen from './screens/SavedLocationsScreen';
import SettingsScreen from './screens/SettingsScreen';
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
    swipeEnabled: false,
    animationEnabled: false,
    tabBarOptions: {
      activeTintColor: '#FF1654',
      inactiveTintColor: 'black',
      style: {
        backgroundColor: '#A4D7CE',
        height: Dimensions.get('window').height*0.06,
        shadowRadius: 4,
        shadowColor: 'grey',
        shadowOffset: {height: 2, width: 0},
        shadowOpacity: 1.0
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
                    zIndex: 1}}>
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

const SettingsDrawerNavigator = createDrawerNavigator({
  Feed: FeedScreen,
  Settings: SettingsScreen,
}, {
  initialRouteName: 'Feed',
  drawerPosition: 'left',
  contentComponent: DrawerComponent,
  drawerOpenRoute: 'DrawerOpen',
  drawerCloseRoute: 'DrawerClose',
  drawerToggleRoute: 'DrawerToggle',

});

const AppTabNavigator = createMaterialTopTabNavigator({
  Home: SettingsDrawerNavigator,
  SavedLocations:  SavedLocationsScreen,
  CameraPicture:  CameraPictureScreen,
  CameraVideo:  CameraVideoScreen,
  SubmitText:  SubmitTextScreen,
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
    alignContent: "center",
  },
  topBar: {
    flex: 0,
    fontSize: 20,
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
  }
});
