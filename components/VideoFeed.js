import React from 'react';
import {
  AsyncStorage,
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
    refreshing: false,
    showEndSpinner: false,
    hasScrolled: false,
    outOfData: false,
  };

  constructor(props) {
    super(props);
    this.onEndReachedCalledDuringMomentum = true;
  }

  _keyExtractor =  (item, index) => item.postId;

  _onPressItem = (id: string) => {
      // updater functions are preferred for transactional updates
      this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
      });
  };

  _renderItem = ({item}) => {
    return (
      <FeedItem
        id={item.id}
        onPressItem={this._onPressItem}
        openItemComments={this._openItemComments}
        removeItem={this._removeItem}
        selected={!this.state.selected.get(item.id)}
        item={item}
        navigation={this.props.navigation}
      />
  )};

  _renderFooter = () => {
    if (!this.state.showEndSpinner) {
      if (!this.state.outOfData) return <View/>

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
      console.log("Couldn't get feed data because: " + responseJson.error);
    } else {
      if (responseJson.length == 0) {
        this.setState({outOfData: true});
      } else {
        this.setState({outOfData: false});
      }
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

  _removeItem = async (item) => {
    var index = this.props.data.findIndex((i) => {
      return i.id == item.id;
    });
    this.props.data.splice(index, 1);
    await AsyncStorage.setItem('feedData', JSON.stringify(this.props.data));
    this.setState({update: true});
  }

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
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
  },
});
