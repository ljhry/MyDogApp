import React, { Component } from 'react'
import {Platform, StyleSheet, Text, View,Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
const Dimensions = require('Dimensions')
const {width} = Dimensions.get('window')
export default class MySetting extends Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>狗狗账户</Text>
          </View>
        <Text style={styles.welcome}>我的</Text>
        </View>
    )
  }
}
// export default createStackNavigator(
//   {
//     Home: {
//       screen: MySetting
//     }
//   },
//   {
//     navigationOptions: {
//       title: '狗狗账户',
//       headerStyle: {
//         backgroundColor: '#3498db',
//       },
//       headerTintColor: '#fff',
//       headerTitleStyle: {
//         fontWeight: 'bold',
//         fontSize:17
//       },
//       headerRight: (
//         // <Icon name='ios-backspace' size={30} />   
//         <Text style={{color:'#fff',fontSize:16}} onPress={()=>{alert('a')}}>退出登录</Text>  
//       )
//     }
// }
// );
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    header:{
      height: width/6.5,
      backgroundColor: '#3498db',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    },
    headerTitle:{
      color:'#fff',
      fontSize:19,

      fontWeight: 'bold',
    },
    dogimg:{
      width:25,
      height:25,
      marginRight: 12,
    }
});

