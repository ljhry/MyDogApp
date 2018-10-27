import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  AsyncStorage,
  ImageBackground,
  Modal
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-picker";
import sha1 from "sha1";
import * as Progress from "react-native-progress";
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
  cloud_name: "danmvxjxw",
  api_key: "272947267451358",
  api_secret: "B_JdPDsu5h8F3TBb7gJPpp9B8n8",
  base: "http://res.cloudinary.com/danmvxjxw",
  image: "https://api.cloudinary.com/v1_1/danmvxjxw/image/upload/dog",
  video: "https://api.cloudinary.com/v1_1/danmvxjxw/video/video",
  audio: "https://api.cloudinary.com/v1_1/danmvxjxw/audio/audio"
};
let editInputData = [
  {
    iconName : 'ios-paw',
    placeholder:'输入昵称',
    key:'nickname',
    type:'nickname'
  },
  {
    iconName :'logo-github',
    placeholder : '品种',
    key:'bread',
    type:'bread'

  },
  {
    iconName : 'ios-rocket',
    placeholder : '年龄',
    key:'age',
    type:'age'
  },
]
function avatar(id, type) {
  if (id.indexOf("http") > -1) {
    return id;
  }
  if (id.indexOf("data:image")) {
    return id;
  }
  return CLOUDINARY.base + "/" + type + "/upload/" + id;
}
export default class MySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false
    };
    this.pickPhoto = this.pickPhoto.bind(this);
    this._asyncUser = this._asyncUser.bind(this)
  }
  componentDidMount() {
    let that = this;
    AsyncStorage.getItem("user").then(data => {
      let user;
      if (data) {
        user = JSON.parse(data);
      }
      if (user && user.accessToken) {
        that.setState({
          user: user
        });
      }
    });
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  changeState(key,value){
    let user = this.state.user
    user[key] = value
    console.log(value)
    this.setState({
      user:user
    })
  }
  
  _asyncUser(isAvatar) {
    let that = this;
    let user = that.state.user;
    if (user && user.accessToken) {
      let url = config.api.base + config.api.update;

      request.post(url, user).then(data => {
        if (data && data.success) {
          let user = data.data;
          if (isAvatar) {
            alert("头像更新成功");
          }
          that.setState(
            {
              user: user
            },
            function() {
              AsyncStorage.setItem("user", JSON.stringify(user));
            }
          );
        }
      });
    }
  }
  _submit(){
    let that = this
    // that._asyncUser(true)
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

        let avatarData = { uri: "data:image/jpeg;base64" + res.data };
        let user = that.state.user;
        user.avatar = avatarData.uri;
        that.setState({
          user: user
        });

        let timestamp = Date.now();
        let tags = "app,avatar";
        let folder = "avatar";
        let signatureURL = config.api.base + config.api.signature;
        let accessToken = this.state.user.accessToken;
        request
          .post(signatureURL, {
            accessToken: accessToken,
            timestamp: timestamp,
            folder: folder,
            tags: tags,
            type: "avatar"
          })
          .catch(err => {
            console.log(err);
          })
          .then(data => {
            console.log(data);
            if (data && data.success) {
              let signature =
                "folder=" +
                folder +
                "&tags=" +
                tags +
                "&timestamp=" +
                timestamp +
                CLOUDINARY.api_secret;
              signature = sha1(signature);
              console.log("加密" + signature);

              let body = new FormData();
              body.append("accessToken", accessToken);
              body.append("folder", folder);
              body.append("signature", signature);
              body.append("tags", tags);
              body.append("timestamp", timestamp);
              body.append("api_key", CLOUDINARY.api_key);
              body.append("resource_type", "image");
              body.append("file", avatarData);

              that._upload(body);
            }
          });
      }
    });
  }
  _upload(body) {
    console.log("body", body);
    let that = this;
    let xhr = new XMLHttpRequest();
    let url = CLOUDINARY.image;

    console.log(url);
    that.setState({
      avatarUploading: true,
      avatarProgress: 0
    });
    xhr.open("POST", url);
    xhr.onload = () => {
      if (xhr.status !== 200) {
        alert("请求失败1");
        console.log(xhr.responseText);
        return;
      }
      if (!xhr.responseText) {
        alert("请求失败2");
        return;
      }
      console.log("请求成功");
      let response;
      try {
        response = JSON.parse(xhr.response);
        console.log(response);
      } catch (e) {
        console.log(e);
        console.log("失败");
      }
      if (response && response.public_id) {
        let user = this.state.user;
        user.avatar = response.public_id;
        that.setState({
          user: user,
          avatarUploading: false,
          avatarProgress: 0
        });
        that._asyncUser(true);
      }
    };
    if (xhr.upload) {
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          let percent = Number((event.loaded / event.total).toFixed(2));
          that.setState({
            avatarProgress: percent
          });
        }
      };
    }
    xhr.send(body);
  }
  render() {
    // console.log("现在头像", this.state.user.avatar);
    let user = this.state.user;
    // console.log('useraa',user)
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>狗狗账户</Text>
          <TouchableOpacity
            onPress={() => {
              this.setModalVisible(true);
            }}
          >
            <Text style={styles.headerEdit}>编辑</Text>
          </TouchableOpacity>
        </View>
        {user.avatar ? (
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={this.pickPhoto}
          >
            <ImageBackground
              source={{ uri: avatar(user.avatar, "image") }}
              style={styles.avatarContainer}
            >
              <View style={styles.avatarBox}>
                {this.state.avatarUploading ? (
                  <Progress.Circle
                    showsText={true}
                    color={"#3498db"}
                    progress={this.state.avatarProgress}
                    size={75}
                  />
                ) : (
                  <Image
                    source={{ uri: avatar(user.avatar, "image") }}
                    style={styles.avatar}
                  />
                )}
              </View>
              <Text style={styles.avatarTip}>点这换头像</Text>
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={this.pickPhoto}
          >
            <Text style={styles.avatarTitle}>添加狗狗头像</Text>
            <View style={styles.avatarBox} onPress={this.pickPhoto}>
              {this.state.avatarUploading ? (
                <Progress.Circle
                  showsText={true}
                  color={"#3498db"}
                  progress={this.state.avatarProgress}
                  size={75}
                />
              ) : (
                <Icon name="ios-cloud-upload" style={styles.plusIcon} />
              )}
            </View>
          </TouchableOpacity>
        )}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            alert("Modal has been closed.");
          }}
          transparent={true}
        >
        <View style={styles.container}>
        <View style={styles.editBack}>
        <TouchableOpacity onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
          <Icon name="ios-close" style={{fontSize:35,marginRight:20}}></Icon>
        </TouchableOpacity>
        </View>
        {
          editInputData.map((v,index) => {
            return (
            <View style={styles.editInput} key={index}>
            <TextInput
              style={{
                width: width / 1.5,
                height: 45,
                backgroundColor: "#fff",
                left: 40,
              }}
              defaultValue={user[v.key]}
              placeholder={v.placeholder}
              autoCapitalize={"none"}
              autoCorrect={false}
              onChangeText={(text) => {this.changeState(v.key,text)}}
            />
            <Icon
              name={v.iconName}
              size={28}
              color="#ccc"
              style={{ position: "absolute",left:10 }}
            />
          </View>
            )
          })
        }
        <View style={{width:width,height:50,flexDirection:'row',marginTop:15,justifyContent:'space-around'}}>
          <View style={[styles.sexSelector,user.gender === 'male' && styles.genderChecked]}>
            <TouchableOpacity onPress={() => this.changeState('gender','male')}>
              <Text style={{fontSize:28,fontWeight:'bold',color:'#3498db'}}>♂</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.sexSelector,user.gender === 'female' && styles.genderChecked]}>
            <TouchableOpacity onPress={() => this.changeState('gender','female')}>
              <Text style={{fontSize:28,fontWeight:'bold',color:'#3498db'}}>♀</Text>
            </TouchableOpacity>
          </View>
        </View>
         <TouchableOpacity
              onPress={this._asyncUser}
            >
              <View
                style={{
                  height: 50,
                  marginTop: 15,
                  borderColor: "#3498db",
                  borderWidth: 1,
                  borderRadius: 3,
                  justifyContent: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    textAlign: "center",
                    color: "#3498db"
                  }}
                >
                  保存资料
                </Text>
              </View>
            </TouchableOpacity>
        </View>
        </Modal>
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
    justifyContent: "space-between",
    flexDirection: "row"
  },
  editBack:{
    height: width / 6.5,
    backgroundColor: "#F5FCFF",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  headerTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "bold",
    marginLeft: 15
  },
  headerEdit: {
    color: "#fff",
    fontSize: 16,
    marginRight: 15
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
  },
  editInput: {
    marginTop: 8,
    width: width,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#fff"
  },
  sexSelector:{
    width:50,
    height:50,
    borderColor:'#ccc',
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    borderWidth:1,
  },
  genderChecked:{
    borderColor:'#e67e22',

  }
});
