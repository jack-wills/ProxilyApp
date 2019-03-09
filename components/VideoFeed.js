import React from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import FeedItem from './FeedItem';

export default class VideoFeed extends React.Component {
  state = {
    commentsOpen: null,
    selected: (new Map(): Map<string, boolean>),
    videoPlaying: -1,
    refreshing: false,
    showEndSpinner: true,
    hasScrolled: false,
    outOfData: false,
  };

  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
  }

  _keyExtractor =  (item, index) => index.toString();

  _onPressItem = (id: string) => {
      // updater functions are preferred for transactional updates
      this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
      });
  };

  _changeVideoPlaying = (itemId) => {
    this.setState({videoPlaying: itemId});
  }

  _renderItem = ({item}) => (
      <FeedItem
        id={item.id}
        onPressItem={this._onPressItem}
        openItemComments={this._openItemComments}
        selected={!this.state.selected.get(item.id)}
        videoPlaying={this.state.videoPlaying == item.id}
        changeVideoPlaying={this._changeVideoPlaying}
        item={item}
      />
  );

  _renderFooter = () => {
    if (!this.state.showEndSpinner) {
      if (!this.state.outOfData) return <ActivityIndicator style={{marginBottom: 30}}/>

      return (
        <Text style={{marginBottom: 30, textAlign: "center", fontFamily: 'Avenir', fontSize: 15}}>Sorry, that's it for now!</Text>
      )
    }
    return (
      <ActivityIndicator style={{marginBottom: 30}}/>
    )
  }

  _loadDataCallback = (responseJson) => {
    if (responseJson.hasOwnProperty('error')) {
      if (responseJson.error === "OBJECT_NOT_FOUND") {
        this.setState({outOfData: true});
      } else {
        console.log("Couldn't get feed data because: " + responseJson.error);
      }
    } else {
      this.setState({outOfData: false});
    }
  }

  _loadMoreData = async () => {
    if(!this.state.hasScrolled || this.onEndReachedCalledDuringMomentum){ return null; }
    this.setState({showEndSpinner: true});
    await this.props.getFeedData(true, this._loadDataCallback);
    this.setState({showEndSpinner: false});
    this.onEndReachedCalledDuringMomentum = true;
  }

  _onRefresh = async () => {
    this.setState({refreshing: true});
    await this.props.getFeedData(false, this._loadDataCallback);
    this.setState({refreshing: false});
  }

  _openItemComments = (item) => {
    this.props.navigation.navigate(
      'Expanded',
      {item: item}
    );
  };

  render() {
    return (
      <View style={styles.mainContent} >
      <FlatList 
          data={this.props.data}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          refreshControl={
              <RefreshControl
                  colors={["#9Bd35A", "#689F38"]}
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
              />
          }
          onScroll={() => {
            this.setState({hasScrolled: true})
           }}
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          onEndReached={this._loadMoreData}
          onEndReachedThreshold={0.3}
          ListFooterComponent={this._renderFooter}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
});
