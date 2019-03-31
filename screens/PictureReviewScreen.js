import React, {Component} from 'react';
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground, 
  ImageStore, 
  Image,
  Text, 
  Platform,
  View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import {Buffer} from 'buffer';
import LottieView from 'lottie-react-native';
import FileSystem from 'react-native-fs';
import Modal from 'react-native-modal';
import { RNFFmpeg } from 'react-native-ffmpeg';

import {FRONT_SERVICE_URL} from '../Constants';
import MovableObject from '../components/MovableObject';

class PictureReviewScreen extends React.Component {
  state = {
    processing: false,
    success: false,
    error: "",
    currentImage: "",
    animationFinished: false,
    heighestSticker: 1,
    stickers: [],
    stickersPreview: [
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
      "https://i.pinimg.com/736x/82/cf/b2/82cfb200c95adef00650e6450ef42925--pet-logo-cat-silhouette.jpg",
    ],
    filters: [{name: "No filter"}, {name: "Sepia", ffmpeg: ".393:.769:.189:0:.349:.686:.168:0:.272:.534:.131"}, {name: "Greyscale", ffmpeg: ".3:.4:.3:0:.3:.4:.3:0:.3:.4:.3"}],
    stickerOpen: false,
    filtersOpen: false,
    textOpen: false
  }
  //

  async componentDidMount() {
    FileSystem.mkdir(FileSystem.DocumentDirectoryPath + "/proxily/tmp")
    const timestamp = new Date().getTime();
    /*const uri = this.props.navigation.state.params.imageUri;
    const file_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/image" + "_" + timestamp + ".png";
    ImageStore.getBase64ForTag(uri, (data) => {
      FileSystem.writeFile(file_path, data, 'base64');
      this.setState({currentImage: file_path})
    }, (error) =>{
      console.log('Get base64 from imagestore,',error);
    })
    ImageStore.removeImageForTag(uri)*/
    const file_path = '/Users/Jack/Desktop/videoApp/assets/mountains.jpg'
    this.setState({currentImage: file_path})
    let filters = [...this.state.filters]
    filters[0].file_path = file_path;
    for (var i = 1; i < filters.length; i++) {
      let filter = filters[i]
      filter.file_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/filter_" + filter.name + "_" + timestamp + ".png";
      await RNFFmpeg.executeWithArguments(["-i", file_path, "-filter_complex", "colorchannelmixer=" + filter.ffmpeg + "", filter.file_path])
      .then((result) => {
        this.setState({ filters })
        console.log(result)
      });
    }
  }

  submitButtonWidth = new Animated.Value(1);

  toggleSubmitButton = () => {
      Animated.timing(this.submitButtonWidth, {
          toValue: this.submitButtonWidth._value === 1 ? 0 : 1,
          duration: 400
      }).start();
  };

  submitImage = async () => {
    this.toggleSubmitButton();
    this.setState({processing: true})
    let uploadUri = ""
    await fetch(FRONT_SERVICE_URL + '/uploadItem', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude: "51.923147",
          longitude: "-0.226299",
          jwt: this.props.userToken,
          mediaType: "image",
        }),
      })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.hasOwnProperty('error')) {
          this.setState({error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
          console.error(responseJson.error);
        } else {
          uploadUri = responseJson.uploadUrl;
        }
      })
      .catch((error) => {
        this.setState({error: "Oops, looks like something went wrong. Check your internet connection."});
        console.log(error);
      });
      let imageUri = this.props.navigation.state.params.imageUri;
      await ImageStore.getBase64ForTag(imageUri, async (base64Data) => {
        const buffer = Buffer.from(base64Data, 'base64')
        await fetch(uploadUri, {
          method: 'PUT',
          headers: {
          'Content-Type': 'image/jpeg; charset=utf-8',
         },
          body: buffer,
        })
        .then((response) => console.log(response))
        .catch((error) => {
          console.log(error);
        });
        if (Platform.OS == "ios") {
          await ImageStore.removeImageForTag(imageUri);
        } else {
          await FileSystem.unlink(imageUri);
        }
        this.setState({processing: false, success: true})
      }, (error) => console.log(error));
    //Error on screen
  }
  openStickers = () => {
    this.setState({ stickerOpen: true })
  }
  openFilters = () => {
    this.setState({ filtersOpen: true })
  }
  openText = () => {
    this.setState({ textOpen: true })
  }

  stickerUpdate = (scale, rotate, x, y, id) => {
    zIndex = this.state.heighestSticker+1
    idName = "id" + id
    this.setState({[idName]:{scale, rotate, x, y, zIndex}, heighestSticker: zIndex})
  }

  addSticker = (url) => {
    this.setState({
      stickers: [...this.state.stickers, url]
    })
    idName = "id" + this.state.stickers.length
    zIndex = this.state.heighestSticker+1
    this.setState({[idName]:{scale: 1, rotate: 0, x: 0, y:0, zIndex}, heighestSticker: zIndex})
  }
  renderStickers = () => {
    if (this.state.stickers.length == 0) {
      return null
    }
    return this.state.stickers.map((url, id)=> (
      <MovableObject 
        key={id}
        id={id} 
        zIndex={this.state['id' + id].zIndex}
        passInfo={this.stickerUpdate}
        source={url}
      />)
      )
  }

  renderStickersPreview = () => {
    return this.state.stickersPreview.map((url, index)=> (
      <TouchableOpacity onPress={() => {this.addSticker(url); this.setState({stickerOpen: false})}}>
        <Image key={index} style={{height: Dimensions.get('window').width*0.3, width: Dimensions.get('window').width*0.3}} source={{uri: url}} resizeMode={'contain'}/>
      </TouchableOpacity>
      )
    )
  }

  renderFiltersPreview = () => {
    console.log(this.state.filters)
    return this.state.filters.map((filter, index)=> (
      <TouchableOpacity onPress={() => {this.setState({filtersOpen: false, currentImage: filter.file_path})}}>
        <Image key={index} style={{height: Dimensions.get('window').width*0.3, width: Dimensions.get('window').width*0.3}} source={{uri: "file://" + filter.file_path}} resizeMode={'contain'}/>
        <Text style={{textAlign: 'center', fontFamily: 'Avenir', fontSize: 18}}>{filter.name}</Text>
      </TouchableOpacity>
      )
    )
  }
  
  render() {
    if (this.state.animationFinished) {
      let resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'CameraPicture' })
        ],
      });
      this.props.navigation.dispatch(resetAction);
      this.props.navigation.navigate('Feed');
    }
    let button = (
      <TouchableOpacity onPress={this.submitImage}>
          <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    );
    if (this.state.processing) {
      button = (
        <LottieView
          ref={animation => {
            if (animation) {
              animation.play(0, 44);
            }
          }}
          source={require('../assets/loading.json')}
        />
      );
    }
    if (this.state.success) {
      button = (
        <LottieView
          ref={animation => {
            if (animation) {
              this.animation = animation;
              animation.play(44, 95);
            }
          }}
          onAnimationFinish={() => {
            this.setState({animationFinished: true})
          }}
          loop={false}
          source={require('../assets/loading.json')}
        />
      );
    }
    const buttonWidth = this.submitButtonWidth.interpolate({
        inputRange: [0, 1],
        outputRange: [60, Dimensions.get('window').width*0.7]
    });
    return (
      <View style={styles.container}>
        <View style={[styles.iconContainer, {top: 40, left: 20}]}>
          <TouchableOpacity style={styles.icon} onPress={() => { this.props.navigation.goBack() }}>
            <Icon name="close" size={40} color="white"/>
          </TouchableOpacity>
        </View>
        <ImageBackground source={{ uri: "file://" + this.state.currentImage }}
         style={{
            marginTop: 100,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width*8/7,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
          }} 
            resizeMode="contain"
            >
            {this.renderStickers()}
        </ImageBackground>
          <View style={styles.editBox} >
            <TouchableOpacity onPress={this.openStickers}>
              <View style={styles.editButton}>
                <Text style={styles.editButtonText}>Stickers</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openFilters}>
              <View style={styles.editButton}>
                <Text style={styles.editButtonText}>Filters</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.openText}>
              <View style={styles.editButton}>
                <Text style={styles.editButtonText}>Text</Text>
              </View>
            </TouchableOpacity>
          </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Animated.View style={[styles.submitButton,{width: buttonWidth}]} >
            {button}
          </Animated.View>
        </View>
        <Modal
            isVisible={this.state.error != ""}
            onBackdropPress={() => this.setState({ error: "" })}>
            <View style={{alignSelf: 'center',
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
        <Modal
            isVisible={this.state.stickerOpen}
            onBackdropPress={() => this.setState({ stickerOpen: false })}>
          <View style={styles.modal}>
            <ScrollView style={{flex: 1}}>
              <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                {this.renderStickersPreview()}
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
            isVisible={this.state.filtersOpen}
            onBackdropPress={() => this.setState({ filtersOpen: false })}>
          <View style={styles.modal}>
            <ScrollView style={{flex: 1}}>
              <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                {this.renderFiltersPreview()}
              </View>
            </ScrollView>
          </View>
        </Modal>
        <Modal
            isVisible={this.state.textOpen}
            onBackdropPress={() => this.setState({ textOpen: false })}>
          <View style={styles.modal}>
            <Text style={{fontFamily: 'Avenir'}}>{this.state.error}</Text>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'lightgrey',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'absolute'
  },
  submitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    borderRadius: 30,
    height: 60,
  },
  buttonText: {
      fontFamily: 'Avenir',
      color: 'white',
      fontSize: 20,
      padding: 13,
      textAlign: 'center',
  },
  editBox: {
    width: Dimensions.get('window').width,
    height: 60,
    flexDirection: 'row'
  },
  editButton: {
    width: Dimensions.get('window').width/3,
    backgroundColor: 'grey',
    borderWidth: 1
  },
  editButtonText: {
    fontFamily: 'Avenir',
    color: 'white',
    fontSize: 20,
    padding: 13,
    textAlign: 'center',
  },
  modal: {
    alignSelf: 'center',
    width: Dimensions.get('window').width*0.9,
    height: Dimensions.get('window').height*0.85,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    //borderWidth: 1,
    //borderColor: 'lightgrey',
    shadowRadius: 4,
    shadowColor: 'grey',
    shadowOffset: {height: 2, width: 0},
    shadowOpacity: 0.25,
    overflow: 'hidden',
    padding: 15,
  }
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(PictureReviewScreen);