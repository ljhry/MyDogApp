import React, { Component } from 'react'
import {Platform, StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from 'react-navigation'
const Dimensions = require('Dimensions')
const {width} = Dimensions.get('window')
export default class AddVideo extends Component {
  render() {
    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>理解狗狗，从配音开始</Text>
          </View>
        <Text style={styles.welcome}>添加视频</Text>
        </View>
    )
  }
}
// export default createStackNavigator(
//   {
//     Home: {
//       screen: AddVideo
//     }
//   },
//   {
//     navigationOptions: {
//       title: '理解狗狗，从配音开始',
//       headerStyle: {
//         backgroundColor: '#3498db',
//       },
//       headerTintColor: '#fff',
//       headerTitleStyle: {
//         fontWeight: 'bold',
//         fontSize:17
//       },
//     }
// }
// );
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
    },
    header:{
      // paddingTop: 22,
      // paddingBottom: 14,
      height: width/6.5,
      backgroundColor: '#3498db',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle:{
      color:'#fff',
      fontSize:19,
      fontWeight: 'bold',
    }
});

