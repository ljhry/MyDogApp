/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React,{Component} from 'react';
import { AsyncStorage } from "react-native"
import MainStack from './src/components/Main';
// import A from './src/test'
import Login from './src/app/login_register/login';
import {createSwitchNavigator} from 'react-navigation';

export default class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      logined:false,
      user:null
    }
    this._asyncAppStatus = this._asyncAppStatus.bind(this)
    // this._afterLogin = this._afterLogin.bind(this)
  }
  componentDidMount(){
    this._asyncAppStatus()
  }
  _asyncAppStatus(){
    let that = this
    AsyncStorage.getItem('user')
      .then((data) => {
        console.info('存储',data)
        if(data){
          that.setState({
            logined:true
          })
        }
        
      })
  }
  render() {
    // console.log('asd',!this.state.logined)
    // console.log('sb',AsyncStorage.getItem('user'))
    if(!this.state.logined){
      // return <Login afterLogin={this._afterLogin}></Login>
      return <RootStack></RootStack>

    }else{
      return <MainStack></MainStack>
    }
    return (
        <RootStack></RootStack>
    );
  }
}
const RootStack = createSwitchNavigator(
  {
    Main: {
      screen: Login,
    },
    MyModal: {
      screen: MainStack,
    },
  }
);