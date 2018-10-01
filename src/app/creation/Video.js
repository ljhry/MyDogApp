import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, Text, View,FlatList,Image,TouchableOpacity} from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons'
import NavigationService from './NavigationService';
import Videomp4 from 'react-native-video';
const Mock = require('mockjs');
const config = require('../common/config')
const request = require('../common/request')

const Dimensions = require('Dimensions')
const {width} = Dimensions.get('window')

export default class Video extends Component {
  constructor(props){
    super(props)
  }
  render() {
    return (
        <View style={styles.container}>
         < RootStack  ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef)}}></RootStack>
        </View>
    )
  }
}


class Item extends Component{
  constructor(props){
    super(props)
    this.state = {
      voted:false,
    }
    this.addActive = this.addActive.bind(this)
  }
  
  addActive(){
    // alert(this.state.voted)
    let that = this
    let up = !this.state.voted
    let url = config.api.base + config.api.up
    let body = {
      id:this.props.item._id,
      up:up?'yes':'no',
      accessToken:'abcee'
    }
    request.post(url,body)
      .then(function(data){
        if(data && data.success){
          // console.log(that)
          that.setState({
            voted:up
          })
        }else{
          alert('点赞失败')
        }
      })
      .catch(function(err){
        console.log(err)
      })
   
  }
  render(){
    return(
      <View style={styles.VideoContainer} >
     
        <View style={styles.TopContainer}>
          <Text style={{fontSize:15}}>{this.props.item.title}</Text>
        </View>

          <TouchableOpacity 
            onPress={()=>NavigationService.navigate('Details', { userName: this.props.item.title,video:this.props.item.video })}
          >
            <Image
              source={{ uri: this.props.item.thumb }}
              style={styles.thumbnail}
            />
            <View style={styles.play}> 
              <Image source={require('../../images/视频.png')} style={{width:50,height:50}}></Image>
            </View>
          </TouchableOpacity>


          <View style={styles.BottomContainer}>
          <TouchableOpacity onPress={this.addActive}>

            <View style={styles.BottomLeftContainer} >
              <Icon name={this.state.voted?'ios-heart':'ios-heart-empty'} size={30} color='red'></Icon>
              <Text style={{marginLeft:10,fontSize:15}}>喜欢</Text>

            </View>
            </TouchableOpacity>

            <View style={styles.BottomRightContainer}>
              <Image source={require('../../images/评论.png')} style={{width:32,height:32}}></Image>
              <Text style={{marginLeft:10,fontSize:15}}>评论</Text>
            </View>
          </View>
       
      </View>
    )
    
  }
}
let pageNo = 1;//当前第几页
let totalPage=5;//总的页数
let itemNo=0;//item的个数
class A extends Component{
 
  constructor(props){
    super(props)
    this.state = {
      data:[],
      loaded:false,
      isLoadingTail: false,
      isRefreshing:false,
      showFoot:0,    
    }
    this.renderVideo = this.renderVideo.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }
  
  componentDidMount() {
    this.fetchData(pageNo);
  }
 
  fetchData(pageNo) {
    console.log(this.state.isRefreshing)
    if(pageNo !== 0){
      this.setState({
        isLoadingTail: true
      })
    }else{
      this.setState({
        isRefreshing:true
      })
    }
    request.get(config.api.base+config.api.creations,{
      accessToken:'abcdef',
      page: pageNo
    })
      .then(responseData => {
        console.log(responseData)
        if(responseData.success){
          let data = responseData.data
          let dataBolg = [];
          let i = itemNo
         
          
          if(pageNo !== 0){
            data.map((v)=>{
              dataBolg.push({
                thumb:v.thumb,
                _id:v._id,
                video:v.video,
                key:v._id,
                title:v.title
              })
              i++;
            })
            dataBolg = this.state.data.concat(dataBolg)
          }else{
            data.map((v)=>{
              dataBolg.push({
                thumb:v.thumb,
                _id:v._id,
                video:v.video,
                key:v._id,
                title:v.title
              })
            })
            dataBolg = dataBolg.concat(this.state.data)
          }
          itemNo = i;
          
          let foot = 0;
          if(pageNo>=totalPage){
            foot = 1
          }
          if(pageNo !== 0){
            this.setState({
              data:dataBolg,
              loaded:true,
              isLoadingTail:false,
              showFoot:foot
            })
          }else{
            this.setState({
              data:dataBolg,
              loaded:true,
              isRefreshing:false,
              showFoot:foot
            })
          }
          
          data = null;
          dataBolg = null;
        }
        
      })
      .catch((err) => {
        console.log('错误',err)
      })
      .done();
  }
  renderLoadingView() {
    return (
      <View style={styles.LoadingContainer}>
        <ActivityIndicator
          animating={true}
          color='#bdc3c7'
          size="large"
        />
      </View>
    );
  }
  renderVideo({ item }) {
    return (
     <Item item={item}></Item>
    )
  }
  fetchMoreData(){
    if(this.state.showFoot !== 0){
      return;
    }
    if(pageNo!=1 && (pageNo>=totalPage)){
      return;
    }else{
      pageNo++;
    }
    this.setState({showFoot:2})
    this.fetchData(pageNo)
  }
  renderFooter(){
    if (this.state.showFoot === 1) {
        return (
            <View style={{height:30,alignItems:'center',justifyContent:'flex-start',}}>
                <Text style={{color:'#999999',fontSize:14,marginTop:5,marginBottom:5,}}>
                    没有更多数据了
                </Text>
            </View>
        );
    } else if(this.state.showFoot === 2) {
        return (
            <View style={styles.footer}>
                <ActivityIndicator />
                <Text>正在加载更多数据...</Text>
            </View>
        );
    } else if(this.state.showFoot === 0){
        return (
            <View style={styles.footer}>
                <Text></Text>
            </View>
        );
    }
  }
  // hasMore(){
  //   return itemNo !== totalPage
  // }
  _onRefresh(){
    if(this.state.isRefreshing){
      return
    }
    this.fetchData(0)
  }
  render(){
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }
    return(
      <FlatList data={this.state.data}
      renderItem={this.renderVideo}
      onEndReached={this.fetchMoreData.bind(this)}
      ListFooterComponent={this.renderFooter.bind(this)}
      onEndReachedThreshold={20}
      showsVerticalScrollIndicator={false}              
      onRefresh={this._onRefresh.bind(this)}
      refreshing={this.state.isRefreshing}
      style={styles.list}
      />
    )
  }
  
}

class AppleScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      rate:1,
      muted:true,
      resizeMode:'contain',
      repeat:false
    }
  }
  _onLoadStart(){
    console.log('a')
  }
  _onLoad(){
    console.log('a')

  }
  _onProgress(){
    console.log('a')

  }
  _onEnd(){
    console.log('a')

  }
  _onError(){
    console.log('a')

  }
  render() {
    const {navigation} = this.props;
    const username = navigation.getParam('userName','李江')
    const video = navigation.getParam('video','')

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text 
        // onPress={()=>this.props.navigation.navigate('Home')}
        >🍎!+{username}</Text>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Videomp4
            ref='mpVideomp4Player'
            source={{uri:video}}
            style={styles.video}
            volume={5}
            paused={false}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}

            onLoadStart={this._onLoadStart}
            onLoad={this._onLoad}
            onProgress={this._onProgress}
            onEnd={this._onEnd}
            onError={this._onError}
          / >
        </View>
      </View>
    );
  }
}
const RootStack = createStackNavigator({
    // initialRouteName:AppleScreen,
    Home: {
      screen:A
    },
    Details: {
      screen: AppleScreen
    },
    
  },{
    navigationOptions: {
      headerTitle:'狗狗说',

      headerStyle: {
        backgroundColor: '#3498db',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  });
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      // alignItems: 'center',
      // justifyContent: 'center',
    },
    LoadingContainer: {
      flex: 1,
      backgroundColor: '#F5FCFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header:{
      paddingTop: 22,
      paddingBottom: 14,
      backgroundColor: '#3498db',
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle:{
      color:'#fff',
      fontSize:17,
      fontWeight: 'bold',
    },
    thumbnail: {
      width: width,
      height: width/2
    },
    VideoContainer:{
      flex: 1,
      backgroundColor: '#e9ebec',
      marginBottom: 15,
    },
    TopContainer:{
      flex:1,
      flexDirection: 'row',
    },
    BottomContainer:{
      flex:1,
      flexDirection: 'row',
    },
    BottomLeftContainer:{
      flexDirection: 'row',
      width:width/2,
      height:50,
      justifyContent:'center',
      alignItems:'center',
    },
    BottomRightContainer:{
      flexDirection: 'row',
      width:width/2,
      height:50,
      justifyContent:'center',
      alignItems:'center',
    },
    play:{
      position:'absolute',
      bottom:30,
      right: 35,
      width:50,
      height:50,
    },
    video:{
      width:width,
      height:600,
      backgroundColor: '#F5FCFF',
    }
});
