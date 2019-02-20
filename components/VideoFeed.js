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
import FeedItem from './FeedItem';

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
      <FeedItem
        id={item.id}
        onPressItem={this._onPressItem}
        openItemComments={this._openItemComments}
        selected={!this.state.selected.get(item.id)}
        mediaItem={item.media}
        title={item.title}
        item={item}
      />
  );

  _openItemComments = (item) => {
    this.props.navigation.navigate(
      'Expanded',
      {item: item}
    );
  };

  render() {
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
    marginBottom: Dimensions.get('window').height*0.09,
  },
});
