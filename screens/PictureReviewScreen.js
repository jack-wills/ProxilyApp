import React, {Component} from 'react';
import {
  ActivityIndicator,
  Animated,
  CameraRoll,
  Dimensions,
  Keyboard,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground, 
  ImageStore, 
  Image,
  Text, 
  View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import { StackActions, NavigationActions } from 'react-navigation';
import LottieView from 'lottie-react-native';
import FileSystem from 'react-native-fs';
import Modal from 'react-native-modal';
import { RNFFmpeg } from 'react-native-ffmpeg';
import Geolocation from 'react-native-geolocation-service';

import {FRONT_SERVICE_URL} from '../Constants';
import Sticker from '../components/Sticker';
import MovableTextInput from '../components/MovableTextInput';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class PictureReviewScreen extends React.Component {
  state = {
    processing: false,
    error: "",
    currentImage: "",
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
    savingImage: false,
    submitProgress: new Animated.Value(0),
    mounted: true,
  }

  fetchStickers = (lat, long) => {
    fetch(FRONT_SERVICE_URL + '/service/getStickers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: long,
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

  async componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => {this.setState({focused: true})}),
      this.props.navigation.addListener('willBlur', () => {this.setState({focused: false})}),
    ]; 
    if (__DEV__) {
      this.setState({latitude: "51.923187", longitude: "-0.226379"})
    } else {
      Geolocation.getCurrentPosition( (position) => {
        this.setState({latitude: position.coords.latitude, longitude: position.coords.longitude})
        },
        (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
    this.fetchStickers(this.state.latitude, this.state.longitude)
    FileSystem.mkdir(FileSystem.DocumentDirectoryPath + "/proxily/tmp")
    const timestamp = new Date().getTime();
    const uri = this.props.navigation.state.params.imageUri;
    const file_path = FileSystem.DocumentDirectoryPath + "/proxily/tmp/image_" + timestamp + ".png";
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
          if (i == filters.length-1) {
            this.setState({filtersFinished: true})
          }
        }).catch((error) => {
          console.log(error)
          if (i == filters.length-1) {
            this.setState({filtersFinished: true})
          }
        });
      }
    }, (error) =>{
      console.log('Get base64 from imagestore,',error);
    })
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
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


  androidResourcePath = async (resourceName) => {
    var destinationPath = FileSystem.CachesDirectoryPath + '/' + resourceName;

    if (await FileSystem.exists(destinationPath)) {
      return destinationPath;
    }

    await FileSystem.copyFileAssets(resourceName, destinationPath).catch((err) => {
        console.log('Failed to copy android resource: ' + resourceName + ', err message: ' + err.message + ', err code: ' + err.code);
        return undefined;
    });

    return destinationPath;
  }

  iosResourcePath = (resourceName) => {
    return FileSystem.MainBundlePath + '/' + resourceName;
  }

  resourcePath = async (resourceName) => {
    if (Platform.OS === 'ios') {
        return await this.iosResourcePath(resourceName);
    } else {
        return await this.androidResourcePath(resourceName);
    }
  }

  processImage = async () => {
    const timestamp = new Date().getTime();
    let imageUri = FileSystem.DocumentDirectoryPath + "/proxily/tmp/output_" + timestamp + ".png";
    let stickers = [...this.state.stickers];
    if (stickers.length == 0) {
      return this.state.currentImage;
    }
    let inputs = [];
    let filter = [];
    const fontFile = await this.resourcePath("Avenir-Medium.ttf");
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
    let stickerCount = 0;
    for (var i = 0; i < sortedStickers.length; i++) {
      const {scale, rotate, x, y, zIndex, text, color} = stickersInfoArray[i].value;
      if (sortedStickers[i].type === "sticker") {
        let overlayHeight = 250*260/365*scaleToOriginal*scale; 
        let overlayWidth = 250*scaleToOriginal*scale;
        let rotatedOverlayHeight = Math.abs(Math.cos(rotate))*overlayHeight + Math.abs(Math.sin(rotate))*overlayWidth;
        let rotatedOverlayWidth = Math.abs(Math.cos(rotate))*overlayWidth + Math.abs(Math.sin(rotate))*overlayHeight;
        x *= scaleToOriginal;
        y *= scaleToOriginal;
        inputs.push("-i")
        inputs.push(sortedStickers[i].url)
        idName = "id" + i;
        console.log(inputs)
        filter.push("[" + (stickerCount+2) + ":v]scale=" + overlayWidth + ":-1,pad=iw+4:ih+4:color=black@0[scale];[scale]rotate=" 
        + rotate + ":c=none:ow=rotw(" + rotate + "):oh=roth(" + rotate + ") ["+ idName +"];")
        stickerCount++;
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
    let ffmpegCommand = ["-i", this.state.currentImage, "-i", await this.resourcePath("blank.png"), ...inputs, "-filter_complex", filter.join(""), imageUri]
    console.log(ffmpegCommand.join(" "))
    while(!this.state.filtersFinished) {
      await this.sleep(100)
    }
    await RNFFmpeg.executeWithArguments(ffmpegCommand);
    return imageUri
  }

  uploadImage = async (imageUri, lat, long) => {
    let uploadUri = ""
    await fetch(FRONT_SERVICE_URL + '/service/uploadItem', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.props.userToken,
      },
      body: JSON.stringify({
        latitude: lat,
        longitude: long,
        mediaType: "image",
      }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('error')) {
        this.toggleSubmitButton();
        this.setState({processing: false,  error: "Oops, looks like something went wrong on our end. We'll look into it right away, sorry about that."});
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
    file = {uri: imageUri, type: "image/jpeg", name: "string"};
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
              NavigationActions.navigate({ routeName: 'CameraPicture' })
            ],
          });
          navigation.dispatch(resetAction);
          navigation.navigate('New', {refresh:true});
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
  }

  submitImage = async () => {
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
      while(this.state.savingImage) {
        await this.sleep(100)
      }
      let imageUri = await this.processImage();
      this.uploadImage(imageUri, this.state.latitude, this.state.longitude);
    } catch (error) {
      console.log(error)
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

  saveImage = async () => {
    this.setState({savingImage: true});
    try {
      let imageUri = await this.processImage();
      CameraRoll.saveToCameraRoll("file://" + imageUri).then(() => {
        this.setState({savingImage: false});
      })
    } catch (error) {
      console.log(error)
      this.setState({savingVideo: false});
    }
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
      <TouchableOpacity key={"filter_" + index} onPress={() => {this.setState({filtersOpen: false, currentImage: filter.file_path})}}>
        <Image key={"filter_image_" + index} style={{height: Dimensions.get('window').width*0.3, width: Dimensions.get('window').width*0.3}} source={{uri: "file://" + filter.file_path}} resizeMode={'contain'}/>
        <Text key={"filter_text_" + index} style={{textAlign: 'center', fontFamily: 'Avenir', fontSize: 18}}>{filter.name}</Text>
      </TouchableOpacity>
      )
    )
  }
  
  render() {
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
    let saveIcon = (
      <TouchableOpacity onPress={this.saveImage}>
        <Icon name="download" size={40} color="white"/>
      </TouchableOpacity>
    )
    if (this.state.processing) {
      button = (
        <LottieView
          progress={this.state.submitProgress}
          source={require('../assets/loading.json')}
        />
      );
      saveIcon = (
        <View/>
      );
    }
    if (this.state.savingImage) {
      saveIcon = (
        <ActivityIndicator size={'large'}/>
      )
    }
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
          <TouchableOpacity onPress={() => { this.props.navigation.goBack() }}>
            <Icon name="close" size={40} color="white"/>
          </TouchableOpacity>
        </SafeAreaView>
        <SafeAreaView style={[styles.iconContainer, {top: (50-14.14), right: 20}]}>
          {saveIcon}
        </SafeAreaView>
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
            isVisible={this.state.error != "" && this.state.focused}
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
  }
});

const mapStateToProps = (state) => {
  const {userToken} = state.main;
  return {userToken};
}

export default connect(mapStateToProps)(PictureReviewScreen);