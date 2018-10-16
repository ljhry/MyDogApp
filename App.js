/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import MainStack from './src/components/Main'
// import A from './src/test'
import Login from './src/app/login_register/login'
import {createStackNavigator,createSwitchNavigator} from 'react-navigation';
export default class App extends Component {
  render() {
    return (
        // <A></A>
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