import React, { Component } from 'react';
import {
    ActivityIndicator, 
    StyleSheet, 
    Text, 
    View,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView
} from 'react-native';

const Mock = require('mockjs');
const config = require('../common/config')
const request = require('../common/request')

import Videomp4 from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons'

const Dimensions = require('Dimensions')
const {width} = Dimensions.get('window')
export default class VideoDetail extends React.Component {
    constructor(props){
      super(props)
      this.state = {
        data:[],
        rate:1,
        muted:true,
        resizeMode:'contain',
        repeat:false,
        videoReady:false,
        videoProgress:0.01,
        videoTotal:0,
        currentTime:0,
        playing:false,
        paused:false,
        videoOk:true
      }
      this._onProgress = this._onProgress.bind(this)
      this._onEnd = this._onEnd.bind(this)
      this._rePlay = this._rePlay.bind(this)
      this._pause = this._pause.bind(this)
      this._resume = this._resume.bind(this)
      this._onError = this._onError.bind(this)
      this._fetchData = this._fetchData.bind(this)
    }
    _onLoadStart(){
      console.log('a')
    }
    _onLoad(){
      console.log('a')
  
    }
    _onProgress(data){
      console.log(data)
      if(!this.state.videoReady){
        this.setState({
          videoReady:true
        })
      }
      let duration = data.playableDuration
      let currentTime = data.currentTime
      let percent = Number((currentTime/duration).toFixed(2))
      let newState = {
        // playing:true,
        videoTotal:duration,
        currentTime:Number(data.currentTime.toFixed(2)),
        videoProgress:percent
      }
      if(!this.state.videoReady){
        newState.videoReady = true
      }
      if(!this.state.playing){
        newState.playing = true
      }
      this.setState(newState)
    }
    _onEnd(){
      this.setState({
        videoProgress:1,
        playing:false
      })
  
    }
    _onError(){
      this.setState({
          videoOk:false
      }) 
    }
    _rePlay(){
        this.refs.VideoPlayer.seek(0)
    }
    _pause(){
        if(!this.state.paused){
            this.setState({
                paused:true
            })
        } 
    }
    _resume(){
        if(this.state.paused){
            this.setState({
                paused:false
            })
        }
    }
    componentDidMount(){
        this._fetchData()
    }
    _fetchData(){
        let url = config.api.base + config.api.comment
        
        request.get(url,{
            id:124,
            accessToken:'123a'
        })
        .then(function(responData){
            if(responData && responData.success){
                let comments = responData.data
                let dataBolg = []

                comments.map((v)=>{
                    dataBolg.push({
                        data:v,
                        key:v._id
                    })
                })
                dataBolg = this.state.data.concat(dataBolg)

                if(comments && comments.length > 0){
                    this.setState({
                        data : dataBolg
                    })
                }
            }
        })
        .catch((err)=>{
            console.log('错误',err)
        })
        

    }
    static navigationOptions = ({ navigation }) => {
        const params = navigation.state.params || {};
        return {
          headerStyle: {
            backgroundColor: '#3498db',
          },
        headerTintColor: '#fff',

          headerRight: (
           <Icon
            name='md-share'
            size={28}
            color='#fff'
            style={{marginRight:10}}
            onPress={()=>{alert('尽情期待！！！')}}
           ></Icon>
          ),
          headerTitle:'视频详情'
        };
    };
    render() {
      const {navigation} = this.props;
      const avatar = navigation.getParam('avatar','https://dummyimage.com/600x600/79f2c2')
      const title = navigation.getParam('title','')
      const nickname = navigation.getParam('nickname','')
      const video = navigation.getParam('video','')
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={{uri:avatar}} style={{width:42,height:42,borderRadius:21,marginLeft:10}}></Image>
                    <Text style={{fontSize:16,marginLeft:10,fontWeight:'bold',color:'#000'}}>{nickname}</Text>
                </View>
                <View style={styles.title}>
                <Text style={{fontSize:14,marginLeft:10}}>{title}</Text>
                </View>
                <View style={styles.MidContainer}>
                    <View style={styles.videoContainer}>
                        <Videomp4
                            ref='VideoPlayer'
                            source={{uri:video+'123'}}
                            style={styles.video}
                            volume={5}
                            paused={this.state.paused}
                            rate={this.state.rate}
                            muted={this.state.muted}
                            resizeMode={this.state.resizeMode}
                            repeat={this.state.repeat}
                            resizeMode="cover" 
                
                            onLoadStart={this._onLoadStart}
                            onLoad={this._onLoad}
                            onProgress={this._onProgress}
                            onEnd={this._onEnd}
                            onError={this._onError}
                        />
                        {
                            !this.state.videoOk && <Text style={styles.failTest}>很抱歉! 视频出错了! </Text>
                        }
                        {
                            !this.state.videoReady && <ActivityIndicator
                            animating={true}
                            color='#bdc3c7'
                            size="small"
                            style={{position:'absolute'}}
                        />
                        }
                        {
                            this.state.videoReady && !this.state.playing?
                            <Icon
                                onPress={this._rePlay}
                                name='md-refresh'
                                style={styles.playIcon}
                                size={35}                            
                            ></Icon>:null
                        }
                        {
                            this.state.videoReady && this.state.playing?
                            <TouchableOpacity
                                onPress={this._pause }
                                style={styles.pauseBtn}
                            >
                                {
                                    this.state.paused?
                                    <Icon
                                        onPress={this._resume}
                                        name='logo-octocat'
                                        style={styles.resumeIcon}
                                        size={35}                            

                                    ></Icon>:null
                                }
                            </TouchableOpacity>:null
                        }
                    </View>
                    <View style={styles.progressBox}>
                        <View style={[styles.progressBar,{width:width * this.state.videoProgress}]}>
                        </View>
                    </View>
                </View>
                <View>
                    <ScrollView
                        style={{flex:1,width:width}}
                    >

                    </ScrollView>
                </View>

            </View>
        );
    }
  }
const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#F5FCFF'
    },
    header:{
        width:width,
        height:width/6.5,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:3
    },
    title:{
        width:width,
        height:30,
        justifyContent:'center'
    },
    MidContainer:{
        width:width,
        height:width/1.8+3,
        // backgroundColor:'blue',
        marginTop: 5,
    },
    videoContainer:{
        width:width,
        height:width/1.8,
        backgroundColor:'yellow',
        justifyContent:'center',
        alignItems:'center',
        marginTop: 5,

    },
    video:{
        width:width,
        height:width/1.8,
        backgroundColor: '#F5FCFF',
    },
    progressBox:{
        width:width,
        height:3,
        backgroundColor:'#ccc'
    },
    progressBar:{
        width:1,
        height:3,
        backgroundColor:'#d63031'
    },
    playIcon:{
        width:60,
        height:60,
        position:'absolute',
        top:width/4,
        left:width/2-15,
        color:'#74b9ff'
    },
    pauseBtn:{
        width:width,
        height:width/2,
        position:'absolute'
    },
    resumeIcon:{
        width:60,
        height:60,
        position:'absolute',
        alignSelf: 'center',
        top:width/4,
        left:width/2-15,
        color:'#74b9ff'
    },
    failTest:{
        position:'absolute',
        fontSize:16,
        color:'#c8d6e5',
        top:width/4+18
    }
})
  