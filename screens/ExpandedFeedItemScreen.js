import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import FeedItem from '../components/FeedItem.js';


export default class ExpandedFeedItemScreen extends React.Component {
    
      render() {
        item = this.props.navigation.state.params.item;
        item.comments = [
                          {user: 'Jack', body: 'Hello'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}, 
                          {user: 'Jack2', body: 'Hello World'}
                        ];
        return (
            <View style={styles.mainContainer}>
                <FeedItem
                extended={true}
                id={item.id}
                onPressItem={this._onPressItem}
                openItemComments={this._openItemComments}
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