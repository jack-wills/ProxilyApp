import React from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import VideoCompenent from './VideoComponent';

class MyListItem extends React.PureComponent {
    _onPress = () => {
      this.props.onPressItem(this.props.id);
    };
  
    render() {
      return (
        <TouchableOpacity onPress={this._onPress}>
          <View style={styles.container}>
            <VideoCompenent playing={this.props.selected} uri='http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4'/>
          </View>
        </TouchableOpacity>
      );
    }
  }
  
export default class VideoFeed extends React.Component {
  state = {selected: (new Map(): Map<string, boolean>)};

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
      <MyListItem
      id={item.id}
      onPressItem={this._onPressItem}
      selected={!this.state.selected.get(item.id)}
      title={item.title}
      />
  );

  render() {
      return (
        <FlatList 
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});
