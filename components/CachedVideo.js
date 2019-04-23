import React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Platform,
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
            console.log(err)
        })
        
    }
    render() {
        if (!this.state.cachedVideo) {
            return (
                <ActivityIndicator style={[this.props.style, {justifyContent: 'center', alignSelf: 'center'}]} />
            )
        }
        let prefix = (Platform.OS === 'android') ? 'file://' : '';
        return (
            <VideoComponent 
                {...this.props}
                url={prefix + this.state.cachedVideo}
            />
        )
    }
}