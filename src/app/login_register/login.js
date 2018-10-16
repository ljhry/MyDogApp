import React, { Component } from 'react'
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
  Button
} from 'react-native';
const Dimensions = require('Dimensions')
const {width} = Dimensions.get('window')

export default class Login extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.main}>
          <View style={styles.headerTitle}>
              <View>
                  <Text style={{fontSize:20,textAlign:"center"}}>快速登录</Text>
              </View>
          </View>
          <View style={styles.input}>
              <TextInput style={{flex:1,height:45,backgroundColor:"#fff"}}
                 placeholder='请输入手机号'
                 autoCapitalize={'none'}
                 autoCorrect={false}
                 keyboardType={'number-pad'}
              ></TextInput>
          </View>
          <View style={[styles.input]}>
              <TextInput 
                style={{width:width/1.5,height:45,backgroundColor:"#fff",marginRight:10}}
                placeholder='请输入验证码'
                autoCapitalize={'none'}
                autoCorrect={false}
                keyboardType={'number-pad'}
              ></TextInput>
              <TouchableOpacity 
                onPress={()=>{alert(1)}}
              >
              <View style={{width:width/4,height:40,justifyContent:'center',borderColor:'#3498db',borderWidth:1,borderRadius:3}}>
                <Text style={{textAlign:'center'}}>获取验证码</Text>
              </View>
              </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('MyModal')}>
              <View style={{width:width/1.04,height:52,marginTop:15,borderColor:'#3498db',borderWidth:1,borderRadius:3,justifyContent:'center'}}>
                <Text style={{fontSize:18,textAlign:'center',color:"#3498db"}}>登录</Text>
              </View>
          </TouchableOpacity>
          </View>
      </View>
       
         
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  main:{
    padding:8
  },
  headerTitle:{
    marginTop:10,
    width:width/1.04,
    height:35,
    justifyContent:'center',
  },
  input:{
    marginTop:10,
    width:width/1.04,
    height:40,
    flexDirection:'row',
    alignContent:'center'
  }
  
});