import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';
import VideoCompenent from './VideoComponent';

export default class FeedMediaItem extends React.Component {

    render(){
        if (this.props.itemInfo.hasOwnProperty('video')) {
            return(
                <TouchableOpacity style={styles.video} onPress={this.props.itemInfo.video.onPressVideo}>
                    <VideoCompenent 
                        style={styles.video} 
                        playing={!this.props.itemInfo.video.videoPlaying} 
                        url={this.props.itemInfo.video.url}
                    />
                </TouchableOpacity>
            )
        }
        if (this.props.itemInfo.hasOwnProperty('image')) {
            return(
                <Image 
                    style={styles.image}
                    source={{uri: this.props.itemInfo.image.url}}
                />
            )
        }
        if (this.props.itemInfo.hasOwnProperty('text')) {
            return(
                <View style={styles.textBox}>
                    <Text style={styles.text}>{this.props.itemInfo.text.content}</Text>
                </View>
            )
        }
        return(<View/>);
    }
}

const styles = StyleSheet.create({
  video: {
    flex: 1,
    borderRadius: 33,
    marginLeft: -3,
    marginTop: -4,
    marginRight: -3,
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
    //width: 350,
  },
  image: {
    flex: 1,
    borderRadius: 33,
    marginLeft: -3,
    marginTop: -4,
    marginRight: -3,
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
    width: Dimensions.get('window').width*0.96-2, 
    height: Dimensions.get('window').width*0.96*3.5/4,
    overflow: 'hidden',
  },
  textBox: {
    flex: 1,
    borderRadius: 33,
    marginLeft: -3,
    marginTop: -4,
    marginRight: -3,
    borderWidth: 1,
    borderColor: 'rgb(220,220,220)',
    backgroundColor: 'rgb(250,250,250)', 
    width: Dimensions.get('window').width*0.96-4, 
  },
  text: {
    fontFamily: 'Avenir',
    padding: 20,
    textAlign: 'left',
  }
});