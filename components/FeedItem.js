import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Text,
  TextInput,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import FeedMediaItem from './FeedMediaItem';

import {FRONT_SERVICE_URL} from '../Constants';

class FeedItem extends React.Component {
    state = {
      userVote: this.props.item.userVote,
      newComment: "",
    }

    _onPressComments = () => {
      this.props.openItemComments(this.props.item);
    };

    async submitComment() {
      await fetch(FRONT_SERVICE_URL + '/postComment', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt: this.props.userToken,
          postID: this.props.item.postId,
          content: this.state.newComment,
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('error')) {
          console.log(responseJson.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }

    _submitComment = async () => {
      await this.submitComment();
      this.setState({newComment: ""});
      this.commentTextInput.clear();
      await this.props.reloadComments(this.props.item.postId);
    };

    async registerUserVote(vote) {
      await fetch(FRONT_SERVICE_URL + '/registerVote', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jwt: this.props.userToken,
          postID: this.props.item.postId,
          vote: vote
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('error')) {
          console.log(responseJson.error);
        }
      })
      .catch((error) => {
        console.error(error);
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
    
    renderNormal() {
      return (
          <View style={styles.container}>
            <FeedMediaItem itemInfo={this.props.item.media} navigation={this.props.navigation}/>
            <View style={styles.info}>
                <View style={styles.left}>
                  <Image
                    style={[styles.profileImage, {marginLeft: -10}]}
                    source={require('../assets/mountains.jpg')} 
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
                </View>
            </View>
          </View>
      );
    }

    _onRefresh = async () => {
      this.setState({refreshing: true});
      await this.props.reloadComments(this.props.item.postId);
      this.setState({refreshing: false});
    }

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
              renderItem={({item}) => (
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
                            source={item.userVote == 1 ? require('../assets/upvotepressed.png'): require('../assets/upvote.png')}
                        />
                        </TouchableOpacity>
                        <Text style={{flex:0, width: 26, marginLeft: 10, fontFamily: 'Avenir', textAlign: 'center', marginTop: 5, marginBottom: 5}}>
                          {item.totalVotes+item.userVote}
                        </Text>
                        <TouchableOpacity onPress={this._onPressDownvote}>
                        <Image 
                            style={{flex:0, height: 26, width: 26, marginLeft: 10}}
                            source={item.userVote == -1 ? require('../assets/downvotepressed.png'): require('../assets/downvote.png')}
                        />
                        </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
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
          <View style={[styles.container, {width: Dimensions.get('window').width*0.96-3,}]}>
            <FeedMediaItem 
              styles={{width: Dimensions.get('window').width*0.96, }} 
              itemInfo={this.props.item.media}
              navigation={this.props.navigation}
            />
            <View style={styles.info}>
              <View style={styles.left}>
                <Image
                  style={[styles.profileImage, {marginLeft: -10}]}
                  source={require('../assets/mountains.jpg')} 
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
  });

  const mapStateToProps = (state) => {
    const {userToken} = state.main;
    return {userToken};
  }
  
  export default connect(mapStateToProps)(FeedItem);
  