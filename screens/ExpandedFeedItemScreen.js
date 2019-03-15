import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import FeedItem from '../components/FeedItem.js';

import {FRONT_SERVICE_URL} from '../Constants';

class ExpandedFeedItemScreen extends React.Component {
  state = {
    videoPlaying: false,
    comments: [],
    item: this.props.navigation.state.params.item,
    commentsLoading: true,
  };

  _changeVideoPlaying = (itemId) => {
    this.setState({videoPlaying: !this.state.videoPlaying});
  }

  _getComments = async (postID) => {
    this.setState({commentsLoading: true});
    await fetch(FRONT_SERVICE_URL + '/getComments', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jwt: this.props.userToken,
        postID: postID,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        console.error(responseJson.error);
      } else {
        this.props.navigation.state.params.item.comments = responseJson;
        this.setState({comments: responseJson})
      }
    })
    .catch((error) => {
      console.error(error);
    });
    this.setState({commentsLoading: false});
  }

  componentDidMount() {
    this._getComments(this.state.item.postId);
  }

  render() {
    item = this.state.item;
    return (
        <View style={styles.mainContainer}>
          <FeedItem
            extended={true}
            id={this.state.item.id}
            onPressItem={this._onPressItem}
            openItemComments={this._openItemComments}
            videoPlaying={this.state.videoPlaying}
            item={item}
            comments={this.state.comments}
            commentsLoading={this.state.commentsLoading}
            reloadComments={this._getComments}
            changeVideoPlaying={this._changeVideoPlaying}
            navigation={this.props.navigation}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      backgroundColor: '#F0F6F9',
    }
  });

  const mapStateToProps = (state) => {
    const {userToken} = state.main;
    return {userToken};
  }
  
  export default connect(mapStateToProps)(ExpandedFeedItemScreen);