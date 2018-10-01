import React, { Component } from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons'
import AddVideo from '../app/edit/AddVideo';
import MySetting from '../app/account/MySetting';
import Video from '../app/creation/Video'

export default createBottomTabNavigator({
    Home:{screen:Video},
    AddVideo:{screen: AddVideo},
    MySetting:{screen: MySetting}
},
{
    navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({focused,tintColor}) => {
          const { routeName } = navigation.state;
          let iconName;
          if (routeName === 'Home') {
            iconName = 'ios-paw';
          } else if (routeName === 'AddVideo') {
            iconName = `ios-add-circle${focused?'':'-outline'}`;
          } else if(routeName === 'MySetting') {
            iconName = 'ios-contact'
          }
          return <Icon name={iconName} size={30} color={tintColor} />;
        },
      }),
      // tabBarComponent: TabBarBottom,
      tabBarPosition: 'bottom',
      tabBarOptions: {
        activeTintColor: '#3498db',
        inactiveTintColor: 'gray',
      },
      animationEnabled: false,
      swipeEnabled: false, 
})
