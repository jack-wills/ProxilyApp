import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
} from 'react-native';

import ImageCacheManager from './ImageCacheManager';
import VideoComponent from './VideoComponent';

export default class CachedVideo extends React.Component {
    state = {
        cachedVideo: ""
    }

    componentDidMount() {
        ImageCacheManager({})
        .downloadAndCacheUrl(this.props.source.uri)
        .then(res => {
            this.setState({ cachedVideo: res })
        })
        .catch(err => {

        })
        
    }
    render() {
        if (!this.state.cachedVideo) {
            return (
                <ActivityIndicator style={[this.props.style, {justifyContent: 'center', alignSelf: 'center'}]} />
            )
        }
        return (
            <VideoComponent 
                {...this.props}
                url={this.state.cachedVideo}
            />
        )
    }
}