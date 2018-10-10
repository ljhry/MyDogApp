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
    //   console.log(data)
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
    renderComment({ item }) {
        return (
         <CommentItem item={item}></CommentItem>
        )
      }
    _fetchData(){
        let self = this
        let url = config.api.base + config.api.comment
        
        request.get(url,{
            id:124,
            accessToken:'123a'
        })
        .then(function(responData){
            if(responData && responData.success){
                let comments = responData.data
                // console.log('aaa',comments)
                let dataBolg = []

                comments.map((v)=>{
                    dataBolg.push({
                        data:v,
                        key:v._id
                    })
                })
                // dataBolg = this.state.data.concat(dataBolg)

                if(comments && comments.length > 0){
                    self.setState({
                        data : dataBolg
                    })
                }
            }
        })
        .catch((err)=>{
            console.log('错误',err)
        })
        

    }
    static tabBarOptions = ({ navigation }) => {
        return {
            tabBarVisible:false
        }
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
          headerTitle:'视频详情',
          tabBarVisible:false,
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
                
                <View style={styles.MidContainer}>
                    <View style={styles.videoContainer}>
                        <Videomp4
                            ref='VideoPlayer'
                            source={{uri:video+'1'}}
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
                <View style={styles.header}>
                    <Image source={{uri:avatar}} style={{width:45,height:45,marginLeft:10,borderRadius:22.5}}></Image>
                <View style={styles.title}>
                <Text style={{fontSize:16,marginLeft:10,fontWeight:'bold',color:'#000'}}>{nickname}</Text>

                <Text style={{fontSize:15,marginLeft:10}}>{title}</Text>
                </View>
                </View>
                <View style={{width:width,height:78,marginTop:8,alignItems:'center'}}>
                    <View style={styles.writeComment}>
                        <Text style={{fontSize:13,color:'#ccc',marginLeft:5}}>敢不敢评论一个...</Text>
                    </View>
                    <View style={{width:width,alignItems:'flex-start',marginLeft:10,marginTop:3}}>
                        <Text style={{fontWeight:'bold'}}>精彩评论</Text>
                    </View>
                </View>

                <View style={{width:width,marginTop:10}}>
                <FlatList 
                    data={this.state.data}
                    renderItem={this.renderComment}
                    onEndReachedThreshold={20}
                    showsVerticalScrollIndicator={false}    
                    onEndReachedThreshold={20}
                />
                </View>
            </View>
        );
    }
  }
class CommentItem extends Component{
    constructor(props){
        super(props)
    }
    render(){
        const data = this.props.item.data
        // console.log(data)
        return (
            <View style={styles.commpentContainer}>
                <View style={styles.imageContainer}>
                    <Image style={{width:36,height:36,borderRadius:18}} roundAsCircle={true} source={{uri:data.replyBy.avatar}}></Image>
                </View>
                <View style={styles.commentDetails}>
                    <Text style={{marginRight:5,fontSize:16,fontWeight:'bold'}}>{data.replyBy.nickname}</Text>
                    <Text style={{marginRight:5,fontSize:15}}>{data.content}</Text>
                </View>
            </View>
        )
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
        width:width-60,
        height:30,
        justifyContent:'center'
    },
    MidContainer:{
        width:width,
        height:width/2+3,
        // backgroundColor:'blue',
    },
    videoContainer:{
        width:width,
        height:width/2,
        backgroundColor:'yellow',
        justifyContent:'center',
        alignItems:'center',

    },
    video:{
        width:width,
        height:width/2,
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
    },
    commpentContainer:{
        flex:1,
        height:70,
        marginTop:3,
        marginBottom: 5,
        flexDirection:'row',
        backgroundColor: '#F5FCFF',
        alignItems:'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    imageContainer:{
        marginLeft:8,
        justifyContent:'center'
    },
    commentDetails:{
        marginLeft:10,
        width:width/1.2,
        justifyContent:'center'

    },
    writeComment:{
        width:width/1.05,
        height:65,
        borderColor: '#ccc',
        borderRadius: 3,
        borderWidth: 1,
    }
})
  