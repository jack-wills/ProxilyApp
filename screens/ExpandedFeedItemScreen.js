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
                          {id: 1, user: 'Jack', body: 'Hello'}, 
                          {id: 2, user: 'Jack2', body: 'Hello World'}, 
                          {id: 3, user: 'Jack2', body: 'Hello World'}, 
                          {id: 4, user: 'Jack2', body: 'Hello World'}, 
                          {id: 5, user: 'Jack2', body: 'Hello World'}, 
                          {id: 6, user: 'Jack2', body: 'Hello World'}, 
                          {id: 7, user: 'Jack2', body: 'Hello World'}, 
                          {id: 8, user: 'Jack2', body: 'Hello World'}, 
                          {id: 9, user: 'Jack2', body: 'Hello World'}, 
                          {id: 10, user: 'Jack2', body: 'Hello World'}, 
                          {id: 11, user: 'Jack2', body: 'Hello World'}
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
    }
  });