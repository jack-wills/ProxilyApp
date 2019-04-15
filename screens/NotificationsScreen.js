import React from 'react';
import {
  Dimensions,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import {updateSettings} from '../actions/UpdateSettings';

class NotificationsScreen extends React.Component {
  state = {
    modal: null
  }

  _renderEnableDisableModal = (settingsName) => {
    return (
      <View>
      <TouchableOpacity onPress={() => {this._updateSettings(settingsName, true); this.setState({modal: null})}}>
        <View style={styles.optionsRow}>
          <Text>Enable</Text>
        </View>
      </TouchableOpacity>
      <View style={{borderTopWidth: 1, borderColor: 'lightgrey'}}/>
      <TouchableOpacity onPress={() => {this._updateSettings(settingsName, false); this.setState({modal: null})}}>
        <View style={styles.optionsRow}>
          <Text>Disable</Text>
        </View>
      </TouchableOpacity>
      </View>
    )
  }
  _renderItem = ({item}) => {
    if (item.hasOwnProperty('function')) {
      return (
        <TouchableHighlight underlayColor={'#C7D7DD'} onPress={item.function}>
          <View style={styles.listButton}>
            <Text style={styles.buttonText}>{item.label}</Text>
            <Text style={styles.buttonValue}>{item.value}</Text>
          </View>
        </TouchableHighlight>
      )
    } else {
      return (
          <View style={styles.listButton}>
            <Text style={styles.buttonText}>{item.label}</Text>
            <Text style={styles.buttonValue}>{item.value}</Text>
          </View> 
      )
    }
  };

  _updateSettings = (settingsName, value) => {
    this.props.dispatch( (dispatch) => {
      dispatch(updateSettings({...this.props.settings, [settingsName]: value}))
    })
  }
  render() {
    let push = true;
    let data = [
      {
        label: "How should we notify you?", 
      },{
        label: "    Email", 
        value: this.props.settings.shouldNotifyByEmail ? this.props.email : "No",
        function: () => {
          this.setState({modal: this._renderEnableDisableModal("shouldNotifyByEmail")})
        },
      },{
        label: "    SMS", 
        value: this.props.settings.shouldNotifyBySMS ? "07838137764" : "No",
        function: () => {
          this.setState({modal: this._renderEnableDisableModal("shouldNotifyBySMS")})
        },
      },{
        label: "    Push Notifications", 
        value: this.props.settings.shouldNotifyByPush ? "Yes" : "No",
        function: () => {
          this.setState({modal: this._renderEnableDisableModal("shouldNotifyByPush")})
        },
      },{
        label: "What should we notify you about?", 
      },{
        label: "    Trending Posts", 
        value: this.props.settings.shouldNotifyAboutTrending ? "Yes" : "No",
        function: () => {
          this.setState({modal: this._renderEnableDisableModal("shouldNotifyAboutTrending")})
        },
      },{
        label: "Where should we send you notifications about?", 
      },{
        label: "    Last Known Location", 
        value: this.props.settings.shouldNotifyForLastLocation ? "Yes" : "No",
        function: () => {
          this.setState({modal: this._renderEnableDisableModal("shouldNotifyForLastLocation")})
        },
      },{
        label: "    Live Location", 
        value: this.props.settings.shouldNotifyForLiveLocation ? "Yes" : "No",
        function: () => {
          this.setState({modal: this._renderEnableDisableModal("shouldNotifyForLiveLocation")})
        },
      },{
        label: "    Saved Locations", 
        value: this.props.settings.shouldNotifyForSavedLocations ? "Yes" : "No",
        function: () => {
          this.setState({modal: this._renderEnableDisableModal("shouldNotifyForSavedLocations")})
        },
      }
    ]
    return (
      <SafeAreaView style={{backgroundColor: '#02b875', flex: 1}}>
        <View style={{flexDirection:'row', 
                      backgroundColor: '#02b875',
                      shadowRadius: 4,
                      shadowColor: 'grey',
                      shadowOffset: {height: 6, width: 0},
                      shadowOpacity: 0.3,
                      justifyContent: 'center',
                      flexDirection: "row",
                      zIndex: 1, height: 42}}>
          <TouchableOpacity onPress={() => { this.props.navigation.openDrawer() }}>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginLeft: 15, width: 40, height: 40 }}>
              <Icon style={{paddingTop: 2, paddingRight: 20}} name='ios-menu' color='white' size={32}/>
            </View>
          </TouchableOpacity>
          <Image resizeMode={'contain'} source={require('../assets/logo4.png')} style={{flex:1, height: 32, marginTop: 5}}/>
          <TouchableOpacity onPress={() => { this.props.navigation.navigate('SavedLocationsAdd', {addSavedLocation: this._addSavedLocation}) }}>
            <View style={{ justifyContent: 'center', headerLayoutPreset: 'center', marginRight: 15, width: 40, height: 40 }}>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.container}>
          <FlatList 
              data={data}
              renderItem={this._renderItem}
              showsHorizontalScrollIndicator={false}
          />
        </View>
        <Modal
            isVisible={this.state.modal != null}
            onBackdropPress={() => this.setState({ modal: null })}>
            <View style={{alignSelf: 'center',
                justifySelf: 'center',
                backgroundColor: '#f2f2f2',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: 'lightgrey',
                shadowRadius: 4,
                shadowColor: 'grey',
                shadowOffset: {height: 2, width: 0},
                shadowOpacity: 0.25,
                overflow: 'hidden',
                padding: 15,
            }}>
              {this.state.modal}
            </View>
        </Modal>
    </SafeAreaView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D7E7ED',
  },
  topBar: {
    flex: 0,
    fontSize: 20,
    fontFamily: 'Avenir',
    textAlign: "left",
    padding: 10,
    paddingLeft: 20,
  },
  listButton: {
    height: 50,
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    flexDirection: 'row',
    alignItems: 'center'
  },
  buttonText: {
    fontFamily: 'Avenir',
    fontSize: 18,
    marginLeft: 20
  },
  buttonValue: {
    fontFamily: 'Avenir',
    fontSize: 18,
    marginRight: 20,
    color: '#777'
  },
  optionsBox: {
    alignSelf: 'center',
    width: Dimensions.get('window').width*0.6,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'lightgrey',
    shadowRadius: 4,
    shadowColor: 'grey',
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.25,
    overflow: 'hidden'
  },
  optionsRow: {
    height: 50,
    width: Dimensions.get('window').width*0.5,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
});


const mapStateToProps = (state) => {
  const {settings, userToken, name, profilePicture, email} = state.main;
  return {settings, userToken, name, profilePicture, email};
}

export default connect(mapStateToProps)(NotificationsScreen);
