import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import FeedItem from '../components/FeedItem.js';
import Modal from 'react-native-modal';

import {FRONT_SERVICE_URL} from '../Constants';

class ExpandedFeedItemScreen extends React.Component {
  state = {
    videoPlaying: false,
    comments: [],
    item: this.props.navigation.state.params.item,
    commentsLoading: true,
    error: "",
  };

  _changeVideoPlaying = (itemId) => {
    this.setState({videoPlaying: !this.state.videoPlaying});
  }

  _getComments = async (postID) => {
    this.setState({commentsLoading: true});
    await fetch(FRONT_SERVICE_URL + '/service/getComments', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        postID: postID,
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        console.error(responseJson.error);
        this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
      } else {
        this.props.navigation.state.params.item.comments = responseJson;
        this.setState({comments: responseJson})
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
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
          <Modal
              isVisible={this.state.error != ""}
              onBackdropPress={() => this.setState({ error: "" })}>
              <View style={{alignSelf: 'center',
                  justifySelf: 'center',
                  width: Dimensions.get('window').width*0.6,
                  backgroundColor: '#f2f2f2',
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: 'lightgrey',
                  shadowRadius: 4,
                  shadowColor: 'grey',
                  shadowOffset: {height: 2, width: 0},
                  shadowOpacity: 0.25,
                  overflow: 'hidden',
                  padding: 15,
              }}>
              <Text style={{fontFamily: 'Avenir'}}>{this.state.error}</Text>
              </View>
          </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#D7E7ED',
    }
  });

  const mapStateToProps = (state) => {
    const {userToken} = state.main;
    return {userToken};
  }
  
  export default connect(mapStateToProps)(ExpandedFeedItemScreen);