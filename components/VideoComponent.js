import React, {Component} from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Video from 'react-native-video'

export default class VideoComponent extends React.Component {

  renderVideo () {
      var videoWidth = Dimensions.get('window').width*0.96;
      return(
        <Video
          source={{uri: this.props.url}}
          style={{ 
              width: videoWidth, 
              height: videoWidth*3/4,
              borderRadius: 12,
            }}
          muted={true}
          paused={this.props.playing}
          repeat={true}
          resizeMode={"cover"}
          volume={1.0}
          rate={1.0}
          ignoreSilentSwitch={"obey"}

        />
      )
  }
//'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_30fps_normal.mp4'
  render () {
    return (
      <View style={styles.backgroundVideo}>
        {this.renderVideo()}
      </View>
    )
  }
}

// Later on in your styles..
var styles = StyleSheet.create({
  backgroundVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});