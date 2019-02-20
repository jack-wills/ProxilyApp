import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import ExtendedFeedItem from '../components/ExtendedFeedItem.js';


export default class ExpandedFeedItemScreen extends React.Component {
    
      render() {
        item = this.props.navigation.state.params.item;
        return (
            <View style={styles.mainContainer}>
                <ExtendedFeedItem
                id={item.id}
                onPressItem={this._onPressItem}
                openItemComments={this._openItemComments}
                title={item.title}
                mediaItem={item.media}
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
    }
  });