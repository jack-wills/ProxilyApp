import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Video from 'react-native-video'
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {updateVideoTime} from '../actions/UpdateVideo';
import InView from './InView'

class VideoComponent extends React.Component {
  state = {
    focused: false,
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', () => {
      if (this.player) {
        this.player.seek(this.props.currentVideoTime);
      }
    });
    this.props.navigation.addListener('willBlur', () => {
      if (this.player) {
        this.player.seek(this.props.currentVideoTime);
      }
    });
  }

  checkVisible(isVisible) {
    if (isVisible) {
      if (!this.state.focused) {
        this.setState({focused: true});
      }
    } else {
      if (this.state.focused) {
        this.setState({focused: false});
      }
    }
  }

  renderVideo () {
      var videoWidth = Dimensions.get('window').width*0.96-2;
      return(
          <Video
            ref={plr => {
              this.player = plr;
            }}
            source={{uri: this.props.url}}
            style={{ 
                width: videoWidth, 
                height: videoWidth*8/7,
                borderRadius: 30,
              }}
            muted={false}
            paused={!this.props.playing || !this.state.focused}
            repeat={true}
            resizeMode={"cover"}
            volume={1.0}
            rate={1.0}
            ignoreSilentSwitch={"obey"}
            onProgress={({currentTime}) => {
              this.props.updateVideoTime(this.props.url, currentTime);
            }}
            onLoadStart={() => {
              if (this.player) {
                this.player.seek(this.props.currentVideoTime);
              }
            }}

          />
      )
  }
  render () {
    return (
      <InView onChange={(isVisible) => this.checkVisible(isVisible)}>
        <View style={styles.backgroundVideo}>
          {this.renderVideo()}
        </View>
      </InView>
    )
  }
}

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1,
    justifyContent: 'flex-start',
    borderRadius: 30,
    borderWidth:0,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

const mapDispatchToProps = (dispatch) => ({
	updateVideoTime: bindActionCreators(updateVideoTime, dispatch)
})

const mapStateToProps = (state, ownProps) => {
  const {video} = state.main;
  let currentVideoTime = 0;
  let playing = false;
  if (video.hasOwnProperty(ownProps.url)) {
    if (video[ownProps.url].hasOwnProperty('time')) {

      console.log('current video = ' + video[ownProps.url]);
      currentVideoTime = video[ownProps.url].time;
    }
  }
  if (state.main.hasOwnProperty('currentVideoPlaying')) {
    playing = state.main.currentVideoPlaying == ownProps.url;
  }
  return {currentVideoTime, playing}
}

export default connect(mapStateToProps,mapDispatchToProps)(VideoComponent);