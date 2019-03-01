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
    data: this.props.data,
    selected: (new Map(): Map<string, boolean>),
    videoPlaying: -1,
    refreshing: false,
    showEndSpinner: true,
  };

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
    if (!this.state.showEndSpinner) return null

    return (
      <ActivityIndicator style={{marginBottom: 30}}/>
    )
  }

  _loadMoreData = () => {
    this.setState({showEndSpinner: true});
    this.props.getFeedData();
    this.setState({showEndSpinner: false});
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.getFeedData();
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
          onEndReached={this.props.getFeedData}
          onEndReachedThreshold={10}
          ListFooterComponent={this._renderFooter}
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContent: {
    //height: Dimensions.get('window').height*0.74,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
});
