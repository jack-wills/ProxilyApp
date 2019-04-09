import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Share,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Text,
  TextInput,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/SimpleLineIcons'
import Modal from "react-native-modal";

import FeedMediaItem from './FeedMediaItem';
import {FRONT_SERVICE_URL} from '../Constants';
import CommentFeedItem from './CommentFeedItem';
import CachedImage from './CachedImage';

class FeedItem extends React.Component {
    state = {
      userVote: this.props.item.userVote,
      newComment: "",
      error: "",
    }

    _onPressComments = () => {
      this.props.openItemComments(this.props.item);
    };

    async submitComment() {
      await fetch(FRONT_SERVICE_URL + '/service/postComment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.userToken,
        },
        body: JSON.stringify({
          postID: this.props.item.postId,
          content: this.state.newComment,
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

    _submitComment = async () => {
      await this.submitComment();
      this.setState({newComment: ""});
      this.commentTextInput.clear();
      await this.props.reloadComments(this.props.item.postId);
    };

    async registerUserVote(vote) {
      await fetch(FRONT_SERVICE_URL + '/service/registerVote', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.userToken,
        },
        body: JSON.stringify({
          postID: this.props.item.postId,
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

    _toggleOptions = () => {
      this.setState({ optionsVisible: true })
    };

    _shareItem = async () => {
      let item = this.props.item;
      let media = this.props.item.media;
      let shareOptions = {
        title: 'Proxily',
        subject: 'Proxily'
      };
      if (media.hasOwnProperty('video')) {
        shareOptions.url = media.video.url;
      } else if (media.hasOwnProperty('image')) {
        shareOptions.url = media.image.url;
      } else if (media.hasOwnProperty('text')) {
        shareOptions.message = media.text.content;
      }
      try {
        const result = Share.share(shareOptions);
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    };

    _reportItem = async () => {
      this.setState({reporting: true})
      await fetch(FRONT_SERVICE_URL + '/service/reportPost', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.props.userToken,
        },
        body: JSON.stringify({
          postID: this.props.item.postId
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({reporting: false})
        if (responseJson.hasOwnProperty('error')) {
          console.log(responseJson.error);
          this.setState({reportStatus: "Sorry an error has occured"})
        } else {
          this.setState({reportStatus: "Post Reported"})
        }
      })
      .catch((error) => {
        console.log(error);
        this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
      });
      this.props.removeItem(this.props.item)
    };
    
    renderNormal() {
      let report = (
        <TouchableOpacity onPress={this._reportItem}>
          <View style={styles.optionsRow}>
            <Icon style={{marginLeft: 10, marginRight: 13}} name="flag" color={'#555'} size={17} />
            <Text>Report</Text>
          </View>
        </TouchableOpacity>
      );
      if (this.state.reportStatus) {
        report = (
          <View style={[styles.optionsRow, {justifyContent: 'flex-start'}]}>
            <Icon style={{marginLeft: 10, marginRight: 13}} name={this.state.reportStatus === "Post Reported" ? "check" : "close"} color={'#555'} size={17} />
            <Text>{this.state.reportStatus}</Text>
          </View>
        )
      }
      if (this.state.reporting) {
        report = (
          <View style={[styles.optionsRow, {justifyContent: 'center', marginLeft: 10}]}>
            <ActivityIndicator size="large"/>
          </View>
        )
      }
      return (
          <View style={styles.container}>
            <FeedMediaItem itemInfo={this.props.item.media} navigation={this.props.navigation}/>
            <View style={styles.info}>
                <View style={styles.left}>
                  <CachedImage
                    style={[styles.profileImage, {marginLeft: -10}]}
                    source={{uri: this.props.item.submitterProfilePicture}} 
                  />
                  <View style={{marginLeft: 10, justifyContent: 'center'}}>
                    <Text style={styles.subByText}>Submitted by {this.props.item.submitter}</Text>
                    <Text style={styles.commentsText} onPress={this._onPressComments}>Comments...</Text>
                  </View>
                </View>
                <View style={styles.right}>
                    <Text style={styles.voteText}>{this.props.item.totalVotes+this.state.userVote}</Text>
                    <TouchableOpacity onPress={this._onPressUpvote}>
                    <Image 
                        style={{flex:0, height: 26, width: 26, marginLeft: 10}}
                        source={this.state.userVote == 1 ? require('../assets/upvotepressed.png'): require('../assets/upvote.png')}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._onPressDownvote}>
                    <Image 
                        style={{flex:0, height: 26, width: 26, marginLeft: 8, marginTop: 2}}
                        source={this.state.userVote == -1 ? require('../assets/downvotepressed.png'): require('../assets/downvote.png')}
                    />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._toggleOptions}>
                      <Icon style={{flex:0, marginRight: -14, marginLeft: 3}} name="options-vertical" color={'#999'} size={25} />
                    </TouchableOpacity>
                </View>
                <Modal
                  isVisible={this.state.optionsVisible}
                  onBackdropPress={() => this.setState({ optionsVisible: false })}>
                  <View style={styles.optionsBox}>
                    <TouchableOpacity onPress={this._shareItem}>
                      <View style={styles.optionsRow}>
                        <Icon style={{marginLeft: 10, marginRight: 13}} name="action-redo" color={'#555'} size={17} />
                        <Text>Share</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{borderTopWidth: 1, borderColor: 'lightgrey'}}/>
                    {report}
                  </View>
                </Modal>
            </View>
          </View>
      );
    }

    _onRefresh = async () => {
      this.setState({refreshing: true});
      await this.props.reloadComments(this.props.item.postId);
      this.setState({refreshing: false});
    }

    _renderComment = ({item}) => {
      return (
        <CommentFeedItem
          item={item}
        />
    )};

    renderComments() {
      if (this.props.commentsLoading) {
        return (
          <ActivityIndicator size="large" style={{marginTop: 20}}/>
        );
      }
      if (this.props.comments.length < 1) {
        return (
          <Text>No comments to show</Text>
        );
      }
      return (
        <FlatList
              data={this.props.comments}
              renderItem={this._renderComment}
              refreshControl={
                  <RefreshControl
                      colors={["#9Bd35A", "#689F38"]}
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh}
                  />
              }
              keyExtractor={(item, index) => index.toString()}
            />
      );
    }

    renderExtended() {
      return (
        <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}>
          <View style={[styles.container, {width: Dimensions.get('window').width*0.96-3, marginBottom: 25}]}>
            <FeedMediaItem 
              styles={{width: Dimensions.get('window').width*0.96, }} 
              itemInfo={this.props.item.media}
              navigation={this.props.navigation}
            />
            <View style={styles.info}>
              <View style={styles.left}>
                <Image
                  style={[styles.profileImage, {marginLeft: -10}]}
                  source={{uri: this.props.item.submitterProfilePicture}}
                />
                <View style={{marginLeft: 10, justifyContent: 'center'}}>
                  <Text style={styles.subByText}>Submitted by {this.props.item.submitter}</Text>
                </View>
              </View>
              <View style={{
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
                <Text style={styles.voteText}>{this.props.item.totalVotes+this.state.userVote}</Text>
                <TouchableOpacity onPress={this._onPressUpvote}>
                <Image 
                    style={{flex:0, height: 26, width: 26, marginLeft: 10}}
                    source={this.state.userVote == 1 ? require('../assets/upvotepressed.png'): require('../assets/upvote.png')}
                />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._onPressDownvote}>
                <Image 
                    style={{flex:0, height: 26, width: 26, marginLeft: 8, marginTop: 2}}
                    source={this.state.userVote == -1 ? require('../assets/downvotepressed.png'): require('../assets/downvote.png')}
                />
                </TouchableOpacity>
                <TouchableOpacity onPress={this._toggleOptions}>
                  <Icon style={{flex:0, marginRight: -14, marginLeft: 3}} name="options-vertical" color={'#999'} size={25} />
                </TouchableOpacity>
                <Modal
                  isVisible={this.state.optionsVisible}
                  onBackdropPress={() => this.setState({ optionsVisible: false })}>
                  <View style={styles.optionsBox}>
                    <TouchableOpacity onPress={this._shareItem}>
                      <View style={styles.optionsRow}>
                        <Icon style={{marginLeft: 10, marginRight: 13}} name="action-redo" color={'#555'} size={17} />
                        <Text>Share</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={{borderTopWidth: 1, borderColor: 'lightgrey'}}/>
                    <TouchableOpacity onPress={this._reportItem}>
                      <View style={styles.optionsRow}>
                        <Icon style={{marginLeft: 10, marginRight: 13}} name="flag" color={'#555'} size={17} />
                        <Text>Report</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </View>
            </View>
            <View style={styles.commentInputBox}>
              <TextInput ref={input => { this.commentTextInput = input }} style={styles.commentInput} multiline={true} placeholder="Enter Comment..." onChangeText={(text) => this.setState({newComment: text})}/>
              <TouchableOpacity style={styles.submitButton} onPress={this._submitComment}>
                <Text style={styles.submitButtonText}>Submit Comment</Text>
              </TouchableOpacity>
            </View>
            {this.renderComments()}
          </View>
        </ScrollView>
      );
    }

    render() {
        if (this.props.extended) {
            return this.renderExtended();
        }
        return this.renderNormal();
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: "column",
      backgroundColor: 'white',
      borderRadius: 33,
      borderWidth: 1,
      borderColor: 'rgb(230,230,230)',
      padding:0,
      marginTop: 10,
      marginBottom: 5,
      shadowRadius: 4,
      shadowColor: 'grey',
      shadowOffset: {height: 2, width: 0},
      shadowOpacity: 0.3,
      width: Dimensions.get('window').width*0.96,
      
    },
    info: {
      flex: 1,
      width: Dimensions.get('window').width*0.83,
      paddingTop: 15,
      paddingBottom: 15,
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    left: {
      justifyContent: 'center',
      flexDirection: 'row',
    },
    right: {
      justifyContent: 'center',
      flexDirection: 'row',
    },
    subByText: {
      fontFamily: 'Avenir',
      fontSize: 12,
    },
    commentsText: {
      marginTop: 7,
      color: 'grey',
      fontFamily: 'Avenir',
      fontSize: 13,
    },
    profileImage: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    voteText: {
      marginTop: 5,
      fontFamily: 'Avenir',
    },
    commentInput: {
      flex: 1,
      width: Dimensions.get('window').width*0.9-40,
    },
    commentInputBox: {
      flex: 1,
      borderRadius: 25, 
      borderWidth: 1, 
      borderColor: 'lightgrey',
      padding: 10,
      marginBottom: 5,
      alignItems: 'center',
      width: Dimensions.get('window').width*0.9-20,
      minHeight: Dimensions.get('window').height*0.1,
    },
    submitButton: {
      backgroundColor: '#e74c3c',
      borderRadius: 35,
      marginTop: 25,
      width: Dimensions.get('window').width*0.9-40,
    },
    submitButtonText: {
      fontFamily: 'Avenir',
      color: 'white',
      fontSize: 15,
      padding: 5,
      textAlign: 'center',
    },
    optionsBox: {
      alignSelf: 'center',
      width: Dimensions.get('window').width*0.6,
      backgroundColor: '#f2f2f2',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: 'lightgrey',
      shadowRadius: 4,
      shadowColor: 'grey',
      shadowOffset: {height: 2, width: 0},
      shadowOpacity: 0.25,
      overflow: 'hidden'
    },
    optionsRow: {
      height: 50,
      width: Dimensions.get('window').width*0.5,
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
    },
  });

  const mapStateToProps = (state) => {
    const {userToken} = state.main;
    return {userToken};
  }
  
  export default connect(mapStateToProps)(FeedItem);
  