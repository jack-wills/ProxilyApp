import React, {Component} from 'react';
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ImageBackground, 
  ImageStore, 
  Image,
  Text, 
  TextInput,
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
import Sticker from '../components/Sticker';
import MovableTextInput from '../components/MovableTextInput';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

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

  async componentDidMount() {
    FileSystem.mkdir(FileSystem.DocumentDirectoryPath + "/proxily/tmp")
    const timestamp = new Date().getTime();
    const uri = this.props.navigation.state.params.imageUri;
    const file_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/image" + "_" + timestamp + ".png";
    await ImageStore.getBase64ForTag(uri, async (data) => {
      await FileSystem.writeFile(file_path, data, 'base64').then(() => this.setState({currentImage: file_path}));
      ImageStore.removeImageForTag(uri)
      let filters = [...this.state.filters]
      filters[0].file_path = file_path;
      
      for (var i = 1; i < filters.length; i++) {
        let filter = filters[i]
        filter.file_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/filter_" + filter.name + "_" + timestamp + ".png";
        await RNFFmpeg.executeWithArguments(["-i", file_path, "-filter_complex", "colorchannelmixer=" + filter.ffmpeg, filter.file_path])
        .then((result) => {
          this.setState({ filters })
          console.log(result)
        });
      }
    }, (error) =>{
      console.log('Get base64 from imagestore,',error);
    })
  }

  submitButtonWidth = new Animated.Value(1);

  toggleSubmitButton = () => {
      Animated.timing(this.submitButtonWidth, {
          toValue: this.submitButtonWidth._value === 1 ? 0 : 1,
          duration: 400
      }).start();
  };

  submitImage = async () => {
    try {
      this.toggleSubmitButton();
      this.setState({processing: true})
      const timestamp = new Date().getTime();
      let imageUri = FileSystem.DocumentDirectoryPath + "/proxily/tmp/output_" + timestamp + ".png";
      let stickers = [...this.state.stickers];
      let inputs = [];
      let filter = [];
      const fontFile = FileSystem.DocumentDirectoryPath + "/proxily/assets/Avenir-Medium.ttf";
      let originalHeight = this.props.navigation.state.params.imageWidth*8/7;
      let originalWidth = this.props.navigation.state.params.imageWidth;
      let scaleToOriginal = originalWidth/Dimensions.get('window').width;
      let state = this.state
      var stickersInfo = Object.keys(state).filter(function(k) {
          return k.indexOf('id') == 0;
      }).reduce(function(newData, k) {
          newData[k] = state[k];
          return newData;
      }, {});
      let stickersInfoArray = Object.entries(stickersInfo).map(([key, value]) => ({key,value}));
      stickersInfoArray.sort(function(a, b){
        return a.value.zIndex - b.value.zIndex;
      });
      sortedStickers = [];
      for (var i = 0; i < stickers.length; i++) {
        let index = stickersInfoArray[i].key.replace("id", "")
        sortedStickers[i] = stickers[index]
      }
      for (var i = 0; i < sortedStickers.length; i++) {
        const {scale, rotate, x, y, zIndex, text, color} = stickersInfoArray[i].value;
        if (sortedStickers[i].type === "sticker") {
          let overlayHeight = 260*scaleToOriginal*scale; 
          let overlayWidth = 325*scaleToOriginal*scale;
          let rotatedOverlayHeight = Math.abs(Math.cos(rotate))*overlayHeight + Math.abs(Math.sin(rotate))*overlayWidth;
          let rotatedOverlayWidth = Math.abs(Math.cos(rotate))*overlayWidth + Math.abs(Math.sin(rotate))*overlayHeight;
          x *= scaleToOriginal;
          y *= scaleToOriginal;
          inputs.push("-i")
          inputs.push(sortedStickers[i].url)
          idName = "id" + i;
          console.log(inputs)
          filter.push("[" + (i+2) + ":v]scale=" + overlayWidth + ":-1,pad=iw+4:ih+4:color=black@0[scale];[scale]rotate=" 
          + rotate + ":c=none:ow=rotw(" + rotate + "):oh=roth(" + rotate + ") ["+ idName +"];")
          console.log(filter) 
          if (i == sortedStickers.length-1) {
            if (i == 0) {
              filter.push("[0:v][id0]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y))
            } else {
              filter.push("[v" + (i-1) + "][id" + i +"]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y))
            }
          } else if (i == 0) {
            filter.push("[0:v][id0]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y) + "[v0];")
          } else {
            filter.push("[v" + (i-1) + "][id" + i +"]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y) + "[v" + i +"];")
          }
        }
        if (sortedStickers[i].type === "text") {
          fontSize = 100*scaleToOriginal*scale;
          let overlayHeight = fontSize; 
          let overlayWidth = 1000;
          let rotatedOverlayHeight = Math.abs(Math.cos(rotate))*overlayHeight + Math.abs(Math.sin(rotate))*overlayWidth;
          let rotatedOverlayWidth = Math.abs(Math.cos(rotate))*overlayWidth + Math.abs(Math.sin(rotate))*overlayHeight;
          x *= scaleToOriginal;
          y *= scaleToOriginal;
          idName = "id" + i;
          filter.push("[1:v]scale=" + overlayWidth + ":" + overlayHeight + "[textBackground];[textBackground]drawtext=fontfile=" + fontFile + 
          ":text='" + text + "':fontsize=" + fontSize + ":fontcolor=" + color + ":x=(" + overlayWidth + "-text_w)/2:y=(" + overlayHeight + "-text_h)/2[text" +
          i + "];[text" + i + "]rotate=" + rotate + ":c=none:ow=rotw(" + rotate + "):oh=roth(" + rotate + "):c=black@0["+ idName +"];")
          if (i == sortedStickers.length-1) {
            if (i == 0) {
              filter.push("[0:v][id0]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y))
            } else {
              filter.push("[v" + (i-1) + "][id" + i +"]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y))
            }
          } else if (i == 0) {
            filter.push("[0:v][id0]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y) + "[v0];")
          } else {
            filter.push("[v" + (i-1) + "][id" + i +"]overlay=" + ((originalWidth-rotatedOverlayWidth)/2+x) + ":" + ((originalHeight-rotatedOverlayHeight)/2+y) + "[v" + i +"];")
          }
        } 
      }
      let ffmpegCommand = ["-i", this.state.currentImage, "-i", "/Users/Jack/Desktop/blank_true.png", ...inputs, "-filter_complex", filter.join(""), imageUri]
      console.log(ffmpegCommand.join(" "))
      await RNFFmpeg.executeWithArguments(ffmpegCommand);
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
          this.toggleSubmitButton();
          this.setState({processing: false, success: false, error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
          console.error(responseJson.error);
        } else {
          uploadUri = responseJson.uploadUrl;
        }
      })
      .catch((error) => {
        this.toggleSubmitButton();
        this.setState({processing: false, success: false, error: "Oops, looks like something went wrong. Check your internet connection."});
        console.log(error);
      });
      await ImageStore.getBase64ForTag(imageUri, async (base64Data) => {
        const buffer = Buffer.from(base64Data, 'base64')
        await fetch(uploadUri, {
          method: 'PUT',
          headers: {
          'Content-Type': 'image/jpeg; charset=utf-8',
        },
          body: buffer,
        })
        .then(async (response) => {
          console.log(response);
          await FileSystem.unlink(imageUri);
          this.setState({processing: false, success: true})
        })
        .catch((error) => {
          this.toggleSubmitButton();
          console.log(error);
          this.setState({processing: false, success: false, error: "Oops, looks like something went wrong. Check your internet connection."});
        });
      }, (error) => {
        this.toggleSubmitButton();
        this.setState({processing: false, success: false, error: "Oops, looks like something went wrong. Please try again."});
        console.log(error);
      });
    } catch {
      this.toggleSubmitButton();
      this.setState({processing: false, success: false});
    }
  }
  openStickers = () => {
    Keyboard.dismiss();
    this.setState({ stickerOpen: true })
  }
  openFilters = () => {
    Keyboard.dismiss();
    this.setState({ filtersOpen: true })
  }

  stickerUpdate = (scale, rotate, x, y, id) => {
    zIndex = this.state.heighestSticker+1
    idName = "id" + id
    console.log("scale = " + scale + ", rotate = " + rotate + ", x = " + x + ", y = " + y + ", zIndex = " + zIndex)
    const {text, color} = this.state[idName];
    this.setState({[idName]:{scale, rotate, x, y, zIndex, text, color}, heighestSticker: zIndex})
  }

  textUpdate = (text, color, id) => {
    idName = "id" + id
    const {scale, rotate, x, y, zIndex} = this.state[idName];
    this.setState({[idName]:{scale, rotate, x, y, zIndex, text, color}})
  }

  addSticker = (url) => {
    this.setState({
      stickers: [...this.state.stickers, {type: "sticker", url}]
    })
    idName = "id" + this.state.stickers.length
    zIndex = this.state.heighestSticker+1
    this.setState({[idName]:{scale: 1, rotate: 0, x: 0, y:0, zIndex}, heighestSticker: zIndex})
  }

  addText = () => {
    this.setState({
      stickers: [...this.state.stickers, {type: "text"}]
    })
    idName = "id" + this.state.stickers.length
    zIndex = this.state.heighestSticker+1
    this.setState({[idName]:{scale: 1, rotate: 0, x: 0, y:0, zIndex, text: "", color: "white"}, heighestSticker: zIndex})
  }

  renderStickers = () => {
    console.log(this.state.stickers)
    console.log(this.state['id0'])
    if (this.state.stickers.length == 0) {
      return null
    }

    return this.state.stickers.map((item, id)=> {
      if (item.type === "sticker") {
        return (
          <Sticker
            key={id}
            id={id} 
            zIndex={this.state['id' + id].zIndex}
            passInfo={this.stickerUpdate}
            source={item.url}
          />
        )
      }
      if (item.type === "text") {
        return (
          <MovableTextInput
            key={id}
            id={id} 
            zIndex={this.state['id' + id].zIndex}
            passInfo={this.stickerUpdate}
            textUpdate={this.textUpdate}
          />
        )
      }
    })
  }

  renderStickersPreview = () => {
    return this.state.stickersPreview.map((url, index)=> (
      <TouchableOpacity key={"sticker_" + index} onPress={() => {this.addSticker(url); this.setState({stickerOpen: false})}}>
        <Image key={"sticker_" + index} style={{height: Dimensions.get('window').width*0.25, width: Dimensions.get('window').width*0.25, padding: 10}} source={{uri: url}} resizeMode={'contain'}/>
      </TouchableOpacity>
      )
    )
  }

  renderFiltersPreview = () => {
    return this.state.filters.map((filter, index)=> (
      <TouchableOpacity key={"filter_" + index} onPress={() => {this.setState({filtersOpen: false, currentImage: filter.file_path})}}>
        <Image key={"filter_" + index} style={{height: Dimensions.get('window').width*0.3, width: Dimensions.get('window').width*0.3}} source={{uri: "file://" + filter.file_path}} resizeMode={'contain'}/>
        <Text key={"filter_" + index} style={{textAlign: 'center', fontFamily: 'Avenir', fontSize: 18}}>{filter.name}</Text>
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
    let image;
    if (this.state.currentImage === "") {
      image = (
        <View style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width*8/7,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ActivityIndicator size={'large'}/>
        </View>
      )
    } else {
      image = (
        <View style={{
           width: Dimensions.get('window').width,
           height: Dimensions.get('window').width*8/7,
           overflow: 'hidden',
           alignItems: 'center',
           justifyContent: 'center',
         }} >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ImageBackground source={{ uri: "file://" + this.state.currentImage }}
        onPress={Keyboard.dismiss}
         style={{
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
      </TouchableWithoutFeedback>
        </View>
      )
    }
    let button = (
      <TouchableOpacity style={[styles.submitButton, {width: Dimensions.get('window').width*0.7}]} onPress={this.submitImage}>
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

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{height: 100, width: Dimensions.get('window').width}}/>
        </TouchableWithoutFeedback>
        <View style={[styles.iconContainer, {top: 40, left: 20}]}>
          <TouchableOpacity style={styles.icon} onPress={() => { this.props.navigation.goBack() }}>
            <Icon name="close" size={40} color="white"/>
          </TouchableOpacity>
        </View>
        {image}
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
          <TouchableOpacity onPress={this.addText}>
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
    overflow: 'hidden'
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
  },
  textInput: {
    flex:1,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'grey',
    margin: 15,
    padding: 10,
    paddingTop: 13,
    backgroundColor: '#DEEEF4',
    color: '#222'
  }
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(PictureReviewScreen);