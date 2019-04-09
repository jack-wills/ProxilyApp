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

export default class CachedImage extends React.Component {
    state = {
        cachedImage: ""
    }

    componentDidMount() {
        ImageCacheManager({})
        .downloadAndCacheUrl(this.props.source.uri)
        .then(res => {
            this.setState({ cachedImage: res })
        })
        .catch(err => {

        })
        
    }
    render() {
        if (!this.state.cachedImage) {
            return (
                <ActivityIndicator />
            )
        }
        return (
            <Image 
                {...this.props}
                source={{uri: this.state.cachedImage}}
            />
        )
    }
}