import React, {Component} from 'react';
import {
  ActivityIndicator,
  Animated,
  CameraRoll,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image, 
  Text, 
  View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {connect} from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import LottieView from 'lottie-react-native';
import Video from 'react-native-video'
import Modal from 'react-native-modal';
import { RNFFmpeg } from 'react-native-ffmpeg';
import FileSystem from 'react-native-fs';

import {FRONT_SERVICE_URL} from '../Constants';
import Sticker from '../components/Sticker';
import MovableTextInput from '../components/MovableTextInput';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';


class VideoReviewScreen extends React.Component {
  state = {
    processing: false,
    currentVideo: "",
    error: "",
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
    filtersFinished: false,
    filtersOpen: false,
    textOpen: false,
    savingVideo: false,
    submitProgress: new Animated.Value(0),
  }
  getMoreStickers = () => {
    fetch(FRONT_SERVICE_URL + '/service/getStickers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        latitude: "51.923147",
        longitude: "-0.226299",
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error') || !Array.isArray(responseJson)) {
        console.log(responseJson.error);
      } else {
        let stickers = [...this.state.stickers];
        stickers.push(...responseJson);
        this.setState({stickers})
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  applyFilter = async (filter_index) => {
    let filters = [...this.state.filters]
    filter = filters[filter_index]
    if (filter.hasOwnProperty('file_path') && filter.file_path != "") {
      return;
    }
    this.setState({videoFilterProcessing: true})
    let file_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/filter_" + filter.name + "_" + this.state.timestamp + ".mp4";
    filters[filter_index].file_path = file_path;
    while(!this.state.filtersFinished) {
      await this.sleep(100)
    }
    await RNFFmpeg.executeWithArguments(["-i", filters[0].file_path, "-b:v", "2M", "-filter:v", "colorchannelmixer=" + filter.ffmpeg, "-crf", "0", file_path])
    .then((result) => {
      this.setState({ filters, videoFilterProcessing: false })
      console.log(result)
    }).catch((error) => {
      console.log(error)
      this.setState({videoFilterProcessing: false})
      //TODO error handle
    });
  }

  async componentDidMount() {
    this.getMoreStickers()
    const timestamp = new Date().getTime();
    const file_path = this.props.navigation.state.params.videoUri;
    this.setState({timestamp, currentVideo: file_path});
    let filters = [...this.state.filters]
    filters[0].file_path = file_path;
    const thumbnail_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/thumbnail_" + timestamp + ".jpg";
    await RNFFmpeg.executeWithArguments(["-i", file_path, "-vframes", "1", "-f", "image2", thumbnail_path]);
    filters[0].thumbnail_path = thumbnail_path;
    
    for (var i = 1; i < filters.length; i++) {
      let filter = filters[i]
      filter.thumbnail_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/thumbnail_filter_" + filter.name + "_" + timestamp + ".jpg";
      await RNFFmpeg.executeWithArguments(["-i", thumbnail_path, "-filter_complex", "colorchannelmixer=" + filter.ffmpeg, filter.thumbnail_path])
      .then((result) => {
        this.setState({ filters })
        console.log(result)
        if (i == filters.length-1) {
          this.setState({filtersFinished: true})
          console.log(this.state.currentVideo)
        }
      }).catch((error) => {
        console.log(error)
        if (i == filters.length-1) {
          this.setState({filtersFinished: true})
        }
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

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  processVideo = async () => {
    const timestamp = new Date().getTime();
    let videoUri = FileSystem.DocumentDirectoryPath + "/proxily/tmp/output_" + timestamp + ".mp4";
    let stickers = [...this.state.stickers];
    if (stickers.length == 0) {
      return this.state.currentVideo;
    }
    let inputs = [];
    let filter = [];
    const fontFile = "/Users/Jack/Desktop/Avenir-Medium.ttf";
    let originalHeight = this.props.navigation.state.params.videoWidth*8/7;
    let originalWidth = this.props.navigation.state.params.videoWidth;
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
    let ffmpegCommand = ["-i", this.state.currentVideo, "-i", "/Users/Jack/Desktop/blank_true.png", ...inputs, "-b:v", "2M", "-filter_complex:v", filter.join(""), videoUri]
    console.log(ffmpegCommand.join(" "))
    while(!this.state.filtersFinished && !this.state.filtersFinished) {
      await this.sleep(100)
    }
    await RNFFmpeg.executeWithArguments(ffmpegCommand);
    return videoUri
  }

  submitVideo = async () => {
    try {
      this.toggleSubmitButton();
      this.setState({processing: true})
      Animated.loop(
        Animated.sequence([
          Animated.timing(this.state.submitProgress, {
            toValue: 0.47,
            duration: 2000,
          }),
          Animated.timing(this.state.submitProgress, {
            toValue: 0,
            duration: 0,
          })
        ])
      ).start();
      let videoUri = await this.processVideo();
      let uploadUri = ""
      await fetch(FRONT_SERVICE_URL + '/service/uploadItem', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + this.props.userToken,
          },
          body: JSON.stringify({
            latitude: "51.923147",
            longitude: "-0.226299",
            mediaType: "video",
          }),
        })
        .then((response) => response.json())
        .then((responseJson) => {
          if (responseJson.hasOwnProperty('error')) {
            this.toggleSubmitButton();
            this.setState({processing: false, error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
            console.error(responseJson.error);
          } else {
            uploadUri = responseJson.uploadUrl;
          }
        })
        .catch((error) => {
          this.toggleSubmitButton();
          this.setState({processing: false, error: "Oops, looks like something went wrong. Check your internet connection."});
          console.log(error);
        });
        file = {uri: videoUri, type: "video/mp4", name: "string"};
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (e) => {
          // handle notifications about upload progress: e.loaded / e.total
          console.log('progress');
          console.log(e);
          
        }, false);
        let navigation = this.props.navigation;
        xhr.onreadystatechange = async () => {
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              console.log('successfully uploaded presignedurl');
              console.log(xhr);
              Animated.timing(this.state.submitProgress, {
                toValue: 1,
                duration: (1-this.state.submitProgress._value)*4000,
              }).start();
              await this.sleep(2800)
              let resetAction = StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({ routeName: 'CameraVideo' })
                ],
              });
              navigation.dispatch(resetAction);
              navigation.navigate('Feed');
            } else {
              this.toggleSubmitButton();
              this.setState({processing: false, error: "Oops, looks like something went wrong. Check your internet connection."});      
              console.log('failed to upload presignedurl');
              console.log(xhr);
            }
          }
        };
        xhr.open('PUT', uploadUri);
        // for text file: text/plain, for binary file: application/octet-stream
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
    } catch {
      this.toggleSubmitButton();
      this.setState({processing: false});
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

  saveVideo = async () => {
    this.setState({savingVideo: true});
    let videoUri = await this.processVideo();
    CameraRoll.saveToCameraRoll("file://" + videoUri).then(() => {
      this.setState({savingVideo: false});
    })
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
        <Image key={"sticker_image_" + index} style={{height: Dimensions.get('window').width*0.25, width: Dimensions.get('window').width*0.25, padding: 10}} source={{uri: url}} resizeMode={'contain'}/>
      </TouchableOpacity>
      )
    )
  }

  renderFiltersPreview = () => {
    return this.state.filters.map((filter, index)=> (
      <TouchableOpacity key={"filter_" + index} onPress={async () => {this.setState({filtersOpen: false,currentVideo: ""}); await this.applyFilter(index); this.setState({ currentVideo: filter.file_path})}}>
        <Image key={"filter_image_" + index} style={{height: Dimensions.get('window').width*0.3, width: Dimensions.get('window').width*0.3}} source={{uri: "file://" + filter.thumbnail_path}} resizeMode={'contain'}/>
        <Text key={"filter_text_" + index} style={{textAlign: 'center', fontFamily: 'Avenir', fontSize: 18}}>{filter.name}</Text>
      </TouchableOpacity>
      )
    )
  }

  render() {
    let video;
    if (this.state.currentVideo === "") {
      video = (
        <ActivityIndicator size={'large'}/>
      )
    } else {
      video = (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Video
              source={{uri: "file://" + this.state.currentVideo}}
              style={{ 
                width: Dimensions.get('window').width, 
                height: Dimensions.get('window').width*8/7,
              }}
              muted={false}
              paused={false}
              repeat={true}
              resizeMode={"contain"}
              volume={1.0}
              rate={1.0} 
              ignoreSilentSwitch={"obey"}

            />
          </TouchableWithoutFeedback>
      )
    }
    let saveIcon = (
      <TouchableOpacity onPress={this.saveVideo}>
        <Icon name="download" size={40} color="white"/>
      </TouchableOpacity>
    )
    if (this.state.savingVideo) {
      saveIcon = (
        <ActivityIndicator size={'large'}/>
      )
    }
    let button = (
        <TouchableOpacity style={[styles.submitButton, {width: Dimensions.get('window').width*0.7}]} onPress={this.submitVideo}>
            <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
    );
    if (this.state.processing) {
      button = (
        <LottieView
          progress={this.state.submitProgress}
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
        <SafeAreaView style={[styles.iconContainer, {top: (50-14.14), left: 20}]}>
          <TouchableOpacity onPress={() => { RNFFmpeg.cancel(); this.props.navigation.goBack() }}>
            <Icon name="close" size={40} color="white"/>
          </TouchableOpacity> 
        </SafeAreaView>
        <SafeAreaView style={[styles.iconContainer, {top: (50-14.14), right: 20}]}>
          {saveIcon}
        </SafeAreaView>
        <View style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').width*8/7,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').width*8/7,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            opacity: this.state.currentVideo === "" ? 0 : 1
          }} pointerEvents={'box-none'}>
            {this.renderStickers()}
          </View>
          {video}
        </View>
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
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    height: 43,
    width: 43
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
  },
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(VideoReviewScreen);