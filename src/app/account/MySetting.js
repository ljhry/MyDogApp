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
    key:'breed',
    type:'breed'

  },
  {
    iconName : 'ios-rocket',
    placeholder : '年龄',
    key:'age',
    type:'age'
  },
]
function avatar(id, type) {
  // if (id.indexOf("http") > -1) {
  //   return id;
  // }
  // if (id.indexOf("data:image")) {
  //   return id;
  // }
  // if(id.indexOf('avatar/') > -1){
  //   return CLOUDINARY.base + "/" + type + "/upload/" + id;

  // }
  return 'http://pjbgjrvrt.bkt.clouddn.com/' + id
}
export default class MySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false,
    };
    this.pickPhoto = this.pickPhoto.bind(this);
    this._asyncUser = this._asyncUser.bind(this)
    this.logout = this.logout.bind(this)

  }
  componentDidMount() {
    let that = this;
    AsyncStorage.getItem("user").then(data => {
      let user;
      if (data) {
        user = JSON.parse(data);
        console.log('用户信息缓存：',user);
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
    // console.log(user)
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
          console.log('响应',user)
          if (isAvatar) {
            alert("信息更新成功");
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
  getQiniuToken(){
    let accessToken = this.state.user.accessToken;
    let signatureURL = config.api.base + config.api.signature;
    return request
    .post(signatureURL, {
      accessToken: accessToken,
      cloud:'qiniu',
      type: "avatar"
    })
    .catch(err => {
      console.log(err);
    })
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
        const avatarData = {uri: 'data:image/jpeg;base64,' + res.data, isStatic: true};

        // let avatarData = "data:image/jpeg;base64" + res.data
        // let user = that.state.user;
        // user.avatar = res.uri;
        // that.setState({
        //   user: user
        // });
        let uri = res.uri
        console.log('193 '+uri)
        that.getQiniuToken()
          .then((data) => {
            if (data && data.success) {
              console.log('200',data);
              let token = data.data.token
              let key = data.data.key
              let body = new FormData();
              body.append("token", token);
              body.append("key", key);
              body.append("file", {
                type:'image/jepg',
                uri:uri,
                name:key
              });
              that._upload(body);
            }
          })
      }
    });
  }
  _upload(body) {
    console.log("220", body);
    let that = this;
    let xhr = new XMLHttpRequest();
    let url = config.qiniu.upload
    let user = that.state.user

    // console.log(url);
    that.setState({
      avatarUploading: true,
      avatarProgress: 0,
      user:user
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
      let response;
      try {
        response = JSON.parse(xhr.response);
        console.log(response);
      } catch (e) {
        console.log(e);
        console.log("失败");
      }
      if(response){
        let user = this.state.user;

        if(response.public_id){
          user.avatar = response.public_id
        }
        if(response.key){
          user.avatar = response.key;
        }
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
  logout(){
    // var that = this
    AsyncStorage.removeItem('user')
    // this.props.navigation.navigate('Main')
    // alert(1)
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
        <TouchableOpacity
          onPress={this.logout}
                style={{
                  width: width-18,
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
                  退出登录
                </Text>
              </TouchableOpacity>
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
          <Icon name="ios-close" style={{fontSize:35}}></Icon>
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
          <View style={[styles.sexSelector,this.state.user.gender === 'male' && styles.genderChecked]}>
            <TouchableOpacity onPress={() => this.changeState('gender','male')}>
              <Text style={{fontSize:28,fontWeight:'bold',color:'#3498db'}}>♂</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.sexSelector,this.state.user.gender === 'female' && styles.genderChecked]}>
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
                  width:width-18,
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
    backgroundColor: "#F5FCFF",
    alignItems:'center'
  },
  header: {
    height: width / 6.5,
    width:width,
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
