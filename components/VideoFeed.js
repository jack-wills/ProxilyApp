import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import VideoCompenent from './VideoComponent';

class ListItem extends React.PureComponent {
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
          <View style={styles.container}>
        <TouchableOpacity style={styles.video} onPress={this._onPressVideo}>
            <VideoCompenent style={styles.video} playing={!this.state.videoPlaying} url='file:///Users/Jack/Desktop/videoApp/assets/sample.mp4'/>
            
        </TouchableOpacity>
        <View style={styles.info}>
            <View style={styles.left}>
            <Text style={styles.subByText}>Submitted By {this.state.user}</Text>
            <Text style={styles.commentsText} onPress={this._onPressComments}>Comments...</Text>
            </View>
            <View style={styles.right}>
            </View>
            </View>
          </View>
      );
    }
  }
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
  
export default class VideoFeed extends React.Component {
  state = {
    commentsOpen: null,
    selected: (new Map(): Map<string, boolean>),
  };

  _keyExtractor = (item, index) => item.id;

  _onPressItem = (id: string) => {
      // updater functions are preferred for transactional updates
      this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
      });
  };

  _renderItem = ({item}) => (
      <ListItem
        id={item.id}
        onPressItem={this._onPressItem}
        openItemComments={this._openItemComments}
        selected={!this.state.selected.get(item.id)}
        title={item.title}
        item={item}
      />
  );

  _openItemComments = (item) => {
    this.setState({commentsOpen: item});
  };

  render() {
    if (this.state.commentsOpen) {
      var item = this.state.commentsOpen
      return (
        <ListItemExtended style={styles.mainContent} 
          id={item.id}
          onPressItem={this._onPressItem}
          openItemComments={this._openItemComments}
          selected={!this.state.selected.get(item.id)}
          title={item.title}
          item={item}
        />
      );
    }
    return (
      <FlatList style={styles.mainContent} 
          data={this.props.data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
      />
    );
  }
}


const styles = StyleSheet.create({
  mainContent: {
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
