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

const config = require('../common/config')
const request = require('../common/request')

const Dimensions = require('Dimensions')
const {width} = Dimensions.get('window')

export default class Comment extends Component {
  constructor(props){
    super(props)
    this.state = {
      text:'',
      isSending:false,
      data:''
    }
    this._submit = this._submit.bind(this)
   
  }
  componentDidMount(){
    const {navigation} = this.props;
    const data = navigation.getParam('comment','')
    this.setState({
      data:data
    })
  }
  _submit(){
   
    if(!this.state.text){
      alert('留言不能为空')
    }
    if(!this.state.isSending){
      alert('在评论')
    }
    this.setState({
      isSending:true
    },function(){
      var body = {
        accessToken:'abc',
        creation:'123',
        content:this.state.text
      }
      var url = config.api.base + config.api.comment
      request.post(url,body)
        .then(function(data){
          if(data && data.success){
            // console.log(this.props.data)
            items = [{
              content:thi.props.text,
              replyBy:{
                nickname:'狗狗说',
                avatar:'https://dummyimage.com/600x600/79f2c2'
              }
            }]
            this.setState({
              isSending:false,
              data:this.state.data.concat(items)
            })
          }
          
        })
    })
  }
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerStyle: {
        backgroundColor: '#3498db',
      },
      headerTintColor: '#fff',
      headerTitle:'评论',
      tabBarVisible:false,
    };
};
  render() {
    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <View style={{width:width/1.05,marginTop:10}}>
            <TextInput
              style={{width:width/1.05,height:60,borderRadius:3}}
              placeholder="Type here to translate!"
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            ></TextInput>
            <View style={{marginTop: 100,}}>
            <Button
              // onPress={this._submit}
              onPress={() => this.props.navigation.navigate('Details')}

              title="发布"
              color="#8c7ae6"
            ></Button>
            </View>
           
          </View>
        </View>
    )
  }
}
