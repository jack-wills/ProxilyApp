import React from 'react'
import { 
    View, 
    StyleSheet, 
    Dimensions,
    Image,
    Text,
    TouchableOpacity 
} from 'react-native'
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import {FRONT_SERVICE_URL} from '../Constants';

class CommentFeedItem extends React.Component {
  state = {
    userVote: this.props.item.userVote,
    error: "",
  }

  _onPressUpvote = async () => {
    if (this.state.userVote == 1) {
      await this.registerUserVote(0);
      this.setState({userVote: 0});
      this.props.item.userVote = 0;
    } else {
      await this.registerUserVote(1);
      this.setState({userVote: 1});
      this.props.item.userVote = 1;
    }
  };
_onPressDownvote = async () => {
    if (this.state.userVote == -1) {
      await this.registerUserVote(0);
      this.setState({userVote: 0});
      this.props.item.userVote = 0;
    } else {
      await this.registerUserVote(-1);
      this.setState({userVote: -1});
      this.props.item.userVote = -1;
    }
  };

  async registerUserVote(vote) {
    await fetch(FRONT_SERVICE_URL + '/service/voteComment', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        commentID: this.props.item.commentId,
        vote: vote
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        console.log(responseJson.error);
        this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
      }
    })
    .catch((error) => {
      console.log(error);
      this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
    });
  }

  render () {
    let item = this.props.item;
    return (
        <View style={styles.comment}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Image
              style={styles.profileImage}
              source={require('../assets/mountains.jpg')} 
            />
            <View style={{
              backgroundColor: 'lightgrey', 
              marginLeft: 7, 
              borderRadius: 10, 
              padding: 10,
              width: Dimensions.get('window').width*0.9-136, //50 profile, 40 comment padding, 46, upvotes
            }}>
              <Text style={{fontWeight: 'bold'}}>{item.submitter}</Text>
              <Text>{item.comment}</Text>
            </View>

            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              marginLeft: 10,
              marginRight: 10,
            }}>
                <TouchableOpacity onPress={this._onPressUpvote}>
                <Image 
                    style={{flex:0, height: 26, width: 26, marginLeft: 10}}
                    source={this.state.userVote == 1 ? require('../assets/upvotepressed.png'): require('../assets/upvote.png')}
                />
                </TouchableOpacity>
                <Text style={{flex:0, width: 26, marginLeft: 10, fontFamily: 'Avenir', textAlign: 'center', marginTop: 5, marginBottom: 5}}>
                  {item.totalVotes+this.state.userVote}
                </Text>
                <TouchableOpacity onPress={this._onPressDownvote}>
                <Image 
                    style={{flex:0, height: 26, width: 26, marginLeft: 10}}
                    source={this.state.userVote == -1 ? require('../assets/downvotepressed.png'): require('../assets/downvote.png')}
                />
                </TouchableOpacity>
            </View>
          </View>
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
    )
  }
}

// Later on in your styles..
var styles = StyleSheet.create({
  comment: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',
    padding: 10,
    width: Dimensions.get('window').width*0.9,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
});

const mapStateToProps = (state, ownProps) => {
    const {userToken} = state.main;
    return {userToken};
}

export default connect(mapStateToProps)(CommentFeedItem);