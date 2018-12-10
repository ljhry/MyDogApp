import React, { Component } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Button,
  AsyncStorage
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const config = require("../common/config");
const request = require("../common/request");
const Dimensions = require("Dimensions");
const { width } = Dimensions.get("window");

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phoneNumber: "",
      codeSent: false,
      countingDone: false,
      VerifyCode: ""
    };
    this._sendVerifyCode = this._sendVerifyCode.bind(this);
    this._showVerifyCode = this._showVerifyCode.bind(this);
    this._submit = this._submit.bind(this)
  }
  _submit(){
    let that = this;
    let phoneNumber = this.state.phoneNumber;
    let VerifyCode = this.state.VerifyCode;

    if(!phoneNumber || !VerifyCode){
      return alert('手机号或用户名不能为空！')
    }
    let body = {
      phoneNumber: phoneNumber,
      verifyCode:VerifyCode
    };
    let verifyURL = config.api.base + config.api.verify;
    request
      .post(verifyURL, body)
      .then(data => {
        if (data && data.success) {
          AsyncStorage.setItem('user',JSON.stringify(data.data))
          that.props.navigation.navigate('MyModal')
        } else {
          alert(data.err);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  _showVerifyCode() {
    this.setState({
      codeSent: true
    });
  }

  _sendVerifyCode() {
    let that = this;
    let phoneNumber = this.state.phoneNumber;
    if (!phoneNumber) {
      alert("💌输入手机号");
      return;
    }
    let body = {
      phoneNumber: phoneNumber
    };
    let signupURL = config.api.base + config.api.signup;
    request
      .post(signupURL, body)
      .then(data => {
        if (data && data.success) {
          that._showVerifyCode();

        } else {
          alert("获取验证码失败");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.headerTitle}>
            <View>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                快速登录
              </Text>
            </View>
          </View>
          <View style={styles.input}>
            <TextInput
              style={{
                width: width / 1.5,
                height: 45,
                backgroundColor: "#fff",
                left: 40
              }}
              placeholder="请输入手机号"
              autoCapitalize={"none"}
              autoCorrect={false}
              keyboardType={"number-pad"}
              onChangeText={phoneNumber => this.setState({ phoneNumber })}
            />
            <Icon
              name="ios-person"
              size={28}
              color="#ccc"
              style={{ position: "absolute" }}
            />
          </View>
          {!this.state.codeSent ? (
            <View style={[styles.input]}>
              <TextInput
                style={{
                  width: width / 1.5,
                  height: 45,
                  backgroundColor: "#fff",
                  marginRight: 10,
                  left: 40
                }}
                placeholder="请输入验证码"
                autoCapitalize={"none"}
                autoCorrect={false}
                keyboardType={"number-pad"}
                onChangeText={VerifyCode => this.setState({ VerifyCode })}
              />
              <Icon
                name="md-eye-off"
                size={28}
                color="#ccc"
                style={{ position: "absolute" }}
              />
                <TouchableOpacity
                onPress={this._sendVerifyCode}
                >
                  <View
                    style={{
                      width: width / 4,
                      height: 40,
                      justifyContent: "center",
                      borderColor: "#3498db",
                      borderWidth: 0.5,
                      borderRadius: 3
                    }}
                  >
                    <Text style={{ textAlign: "center",fontSize:15}}>再次获取</Text>
                  </View>
                </TouchableOpacity>
            </View>
          ) : null}
          {!this.state.codeSent ? (
            <TouchableOpacity
              // onPress={() => this.props.navigation.navigate('MyModal')}
              onPress={this._submit}
            >
              <View
                style={{
                  width: width / 1.04,
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
                  登录
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              // onPress={() => this.props.navigation.navigate('MyModal')}
              onPress={this._sendVerifyCode}
            >
              <View
                style={{
                  width: width / 1.04,
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
                  获取验证码
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  main: {
    padding: 8
  },
  headerTitle: {
    marginTop: 10,
    width: width / 1.04,
    height: 35,
    justifyContent: "center"
  },
  input: {
    marginTop: 10,
    width: width / 1.04,
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#fff"
  }
});
