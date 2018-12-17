import React, { Component } from "react";
import { createBottomTabNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Ionicons";
import AddVideo from "../app/edit/AddVideo";
import MySetting from "../app/account/MySetting";
import Video from "../app/creation/Video";

export default class Main extends Component {
  render() {
    return <RootStack />;
  }
}

const RootStack = createBottomTabNavigator(
  {
    主页: { screen: Video },
    添加视频: { screen: AddVideo },
    我的: { screen: MySetting }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === "主页") {
          iconName = "ios-paw";
        } else if (routeName === "添加视频") {
          iconName = `ios-add-circle${focused ? "" : "-outline"}`;
        } else if (routeName === "我的") {
          iconName = "ios-contact";
        }
        return <Icon name={iconName} size={30} color={tintColor} />;
      }
    }),
    // tabBarComponent: TabBarBottom,
    tabBarPosition: "bottom",
    tabBarOptions: {
      activeTintColor: "#3498db",
      inactiveTintColor: "gray"
    },
    animationEnabled: false,
    swipeEnabled: false
  }
);
