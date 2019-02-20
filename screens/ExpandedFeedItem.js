import React from 'react';
import {
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Text,
  View,
} from 'react-native';
import VideoCompenent from '../components/VideoComponent';
class ListItemExtended extends React.PureComponent {
    state = {
      user: "test",
      videoPlaying: false,
    }
    _onPressVideo = () => {
      var videoPlayingTemp = this.state.videoPlaying
      this.setState({videoPlaying: !videoPlayingTemp})
    };
    _onPressComments = () => {
      this.setState({user: "Jack"});
      this.props.openItemComments(this.props.item);
    };
    
    render() {
      return (
        <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
        <TouchableOpacity style={styles.video} onPress={this._onPressVideo}>
            <VideoCompenent style={styles.video} playing={!this.state.videoPlaying} url='file:///Users/Jack/Desktop/videoApp/assets/sample.mp4'/>
            
        </TouchableOpacity>
        <View style={styles.comments}>
            <View style={styles.left}>
            <Text style={styles.subByText}>Submitted By {this.state.user}</Text>
            </View>
            <View style={styles.right}>
            </View>
            </View>
            <FlatList
              data={[{user: 'Jack', body: 'Hello'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}, 
                    {user: 'Jack2', body: 'Hello World'}]}
              renderItem={({item}) => (
                <View style={styles.comment}>
                <Text>{item.user}</Text>
                <Text>{item.body}</Text>
                </View>
              )}
            />
          </View>
          </ScrollView>
      );
    }
  }
export default class ExpandedFeedItemScreen extends React.Component {
    
      render() {
        item = this.props.navigation.state.params.item;
        return (
            <View style={styles.mainContainer}>
                <ListItemExtended
                id={item.id}
                onPressItem={this._onPressItem}
                openItemComments={this._openItemComments}
                title={item.title}
                item={item}
            />
            </View>
        );
      }
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const styles = StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      backgroundColor: '#F0F6F9',
      height: SCREEN_HEIGHT*0.8,
    },
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: "column",
      backgroundColor: 'white',
      borderRadius: 33,
      borderWidth: 1,
      borderColor: 'rgb(230,230,230)',
      padding:0,
      marginTop: 10,
      marginBottom: 50,
    },
    video: {
      flex: 1,
      borderRadius: 33,
      marginLeft: -3,
      marginTop: -4,
      marginRight: -3,
      borderWidth: 1,
      borderColor: 'rgb(220,220,220)',
      //width: 350,
    },
    info: {
      flex: 1,
      height: 70,
      width: Dimensions.get('window').width*0.83,
      paddingTop: 10,
      paddingBottom: 5,
      flexDirection: "row",
      //width: 350,
    },
    left: {
      width: Dimensions.get('window').width*0.415,
      //backgroundColor: 'blue',
    },
    right: {
  
      width: Dimensions.get('window').width*0.415,
      //backgroundColor: 'red',
    },
    subByText: {
      fontFamily: 'Avenir',
      fontSize: 15,
    },
    commentsText: {
      marginTop: 7,
      color: 'grey',
      fontFamily: 'Avenir',
      fontSize: 13,
    },
    comments: {
      flex: 1,
      width: Dimensions.get('window').width*0.83,
      paddingTop: 10,
      paddingBottom: 5,
      flexDirection: "row",
    },
    comment: {
      flex: 1,
      borderTopWidth: 1,
      borderTopColor: 'lightgrey',
      padding: 10,
      width: Dimensions.get('window').width*0.9,
      height: Dimensions.get('window').height*0.1,
    }
  });