import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-picker";
import sha1 from 'sha1'
const config = require("../common/config");
const request = require("../common/request");
const Dimensions = require("Dimensions");
const { width } = Dimensions.get("window");
var options = {
  title: "选择头像",
  cancelButtonTitle: "取消",
  takePhotoButtonTitle: "拍照",
  chooseFromLibraryButtonTitle: "选择相册",
  cameraType: "back",
  mediaType: "photo",
  videoQuality: "high",
  durationLimit: 10,
  aspectX: 2,
  aspectY: 1,
  quality: 0.8,
  quality: 0.75,
  maxWidth: 700, // 加了这两句控制大小
  maxHeight: 700, // 加了这两句控制大小
  allowsEditing: true,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};
let CLOUDINARY = {
  'cloud_name': 'danmvxjxw',  
  'api_key': '272947267451358',  
  'api_secret': 'B_JdPDsu5h8F3TBb7gJPpp9B8n8',  
  'base': 'http://res.cloudinary.com/danmvxjxw',
  'image':'https://api.cloudinary.com/v1_1/danmvxjxw/image/upload',
  'video':'https://api.cloudinary.com/v1_1/danmvxjxw/image/video',
  'audio':'https://api.cloudinary.com/v1_1/danmvxjxw/image/audio',
}
export default class MySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    };
    this.pickPhoto = this.pickPhoto.bind(this);
  }
  componentDidMount() {
    let that = this;
    AsyncStorage.getItem("user").then(data => {
      let user;
      if (data) {
        user = JSON.parse(data);
        // console.log('sadasd',user)
      }
      if (user && user.accessToken) {
        that.setState({
          user: user
        })
        let timerStamp = Date.now()
        let tags = 'app,avatar'
        let folder = 'avatar'
        let signatureURL = config.api.base + config.api.signature

        request.post(signatureURL,{
          accessToken:accessToken,
          timestamp:timestamp,
          type:'avatar'
        })
        .then((data) =>{
          if(data && data.success){
            let signature = 'folder='+folder+'&tags='+tags+'&timestamp='+timestamp+CLOUDINARY.api_secret
            signature = sha1(signature)
          }
        })
      }
    });
  }
  pickPhoto() {
    let that = this;
    ImagePicker.showImagePicker(options, res => {
      // console.log('res = ', res);

      if (res.didCancel) {
        // console.log('User cancelled image picker');s
        return;
      } else if (res.error) {
        console.log("ImagePicker Error: ", res.error);
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
      } else {
        // You can display the image using either data:
        // const source = {uri: 'data:image/jpeg;base64,' + res.data, isStatic: true};

        let avatarData = { uri: res.uri };
        let user = that.state.user;
        user.avatar = avatarData.uri;
        that.setState({
          user: user
        });
      }
    });
  }
  render() {
    console.log("tutssssssss", this.state.user.avatar);
    let user = this.state.user;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>狗狗账户</Text>
        </View>
        {user.avatar ? (
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={this.pickPhoto}
          >
            <ImageBackground
              source={{ uri: user.avatar }}
              style={styles.avatarContainer}
            >
              <View style={styles.avatarBox}>
                <Image source={{ uri: user.avatar }} style={styles.avatar} />
              </View>
              <Text style={styles.avatarTip}>点这换头像</Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarTitle}>添加狗狗头像</Text>
            <TouchableOpacity 
              style={styles.avatarBox}
              onPress={this.pickPhoto}>
              <Icon name="ios-cloud-upload" style={styles.plusIcon} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  header: {
    height: width / 6.5,
    backgroundColor: "#3498db",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  headerTitle: {
    color: "#fff",
    fontSize: 19,

    fontWeight: "bold"
  },
  dogimg: {
    width: 25,
    height: 25,
    marginRight: 12
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#dcdde1"
  },
  avatarTip: {
    color: "#fff",
    backgroundColor: "transparent",
    fontSize: 14
  },
  avatar: {
    marginBottom: 15,
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: "cover",
    borderRadius: width * 0.1,
    borderWidth: 1
  },
  avatarTitle: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    color: "#fff"
  },
  avatarBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15
  },
  plusIcon: {
    width: width * 0.2,
    height: width * 0.2,
    fontSize: 24,
    borderRadius: 8,
    backgroundColor: "#fafafa",
    lineHeight: width * 0.2,
    textAlign: "center"
  }
});
