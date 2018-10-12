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

export default class Comment extends Component {
  constructor(props){
    super(props)
    this.state = {
      text:''
    }
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
              // onPress={()=>{alert(1)}}
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
