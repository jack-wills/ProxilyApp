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
            console.log(err + this.props.source.uri)
        })
        
    }
    render() {
        if (!this.state.cachedImage) {
            return (
                <ActivityIndicator style={[this.props.style, {justifyContent: 'center', alignSelf: 'center'}]} />
            )
        }
        let prefix = (Platform.OS === 'android') ? 'file://' : '';
        return (
            <Image 
                {...this.props}
                source={{uri: prefix + this.state.cachedImage}}
            />
        )
    }
}