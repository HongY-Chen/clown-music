<template>
  <div class="Detail-box">
    <div class="song-detail-box">
      <div class="img-box">
        <img :src="musicCover" >
      </div>
      <div class="song-detail">
        <p class="song-name">{{currentMusicName}}</p>
      </div>
      <div class="progress-bar">
        <van-progress 
          :percentage="percent"
          stroke-width="10"
          :show-pivot = 'false'
        />
      </div>
      <div class="time">
        <span>{{formatCurrentTime}}</span>
        <span>{{formatTotalTime}}</span>
      </div>
      <div class="control-bar">
        <i class="iconfont icon-weimingmingwenjianjia_xunhuan"></i>
        <i class="iconfont icon-047caozuo_shangyishou" @click="preMusic"></i>
        <i class="iconfont icon-zanting" v-if="!isPlaying" @click="playMusic"></i>
        <i class="iconfont icon-zanting1" v-else @click="stopMusic"></i>
        <i class="iconfont icon-048caozuo_xiayishou" @click="nextMusic"></i>
        <i class="iconfont icon-liebiao"></i>
      </div>
      <!-- 背景层 -->
      <div class="mask_bg" :style="{ 'background':'url('+ currentMusicCover +')' }"></div>
      <div class="mask"></div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  data() {
    return {
      musicCover : '',//歌曲封面
      totalTime:0
    }
  },
  created() {
    //每次进来前要渲染一下当前歌曲信息
    this.musicCover = this.currentMusicCover;
    //拿到歌曲时长
    this.getTotalTime();
  },
  computed:{
    //歌曲列表
    musicList(){
      return this.$store.state.musicList;
    },
    //当前在播放的歌曲专辑图片
    currentMusicCover(){
      return this.$store.state.currentMusicCover;
    },
    //当前在播放的歌曲名
    currentMusicName(){
      return this.$store.state.currentMusicName;
    },
    //当前播放歌曲的地址
    currentMusicUrl(){
      return this.$store.state.currentMusicUrl;
    },
    //播放状态
    isPlaying(){
      return this.$store.state.isPlaying;
    },
    //当前歌曲在列表中的索引
    currentIndex(){
      return this.$store.state.currentIndex;
    },
    //拿到当前播放时间
    currentTime(){
      return this.$store.state.currentTime;
    },
    //格式化当前播放时长
    formatCurrentTime(){
      let startMin = parseInt(this.currentTime / 60);
      startMin = startMin < 10 ? ('0' + startMin) : startMin;

      let startSec = parseInt(this.currentTime % 60);
      startSec = startSec < 10 ? ('0' + startSec) : startSec;

      return startMin + ':' + startSec;
    },
    //格式化歌曲时长
    formatTotalTime(){
      let endMin = parseInt(this.totalTime / 60);
      endMin = endMin < 10 ? ('0' + endMin) : endMin;

      let endSec = parseInt(this.totalTime % 60);
      endSec = endSec < 10 ? ('0' + endSec) : endSec;

      return endMin + ':' + endSec;
    },
    //当前播放的百分比
    percent(){
      return parseInt((this.currentTime / this.totalTime) * 100);
    }
  },
  methods: {
    //拿到歌曲总时长
    getTotalTime(){
      this.totalTime = this.$parent.$refs.audio.duration;
    },
    //根据index初始化歌曲的信息
    updateMusicDetail(index){
      return new Promise((resolve,reject) => {
        //更新索引
        this.$store.commit('changeIndex',index);
        //更改完索引后就是更改歌曲的各种信息了
        this.$store.commit('changeMusicName',this.musicList[index].name);
        //初始化音乐地址
        this.$store.dispatch('updateMusicUrl',this.musicList[index].id).then(() => {
          //更改完地址要主动把播放器的地址也同步一下
          this.$parent.$refs.audio.src = this.currentMusicUrl;
          //初始化歌曲封面
          this.$store.dispatch('updateMusicCover',this.musicList[index].id).then(() => {
            this.musicCover = this.currentMusicCover;
            //初始化歌词
            this.$store.dispatch('updateLyric',this.musicList[index].id).then(() => {
              //初始化歌曲热评
              this.$store.dispatch('updateHotComments',this.musicList[index].id).then(() => {
                //mvid不为0 则初始化MV地址
                if(this.musicList[index].mvid != 0){
                  this.$store.dispatch('updateMvUrl',this.musicList[index].mvid)
                }else{
                  //没有MV的话需要置空当前MV地址
                  this.$store.commit('changeCurrentMvUrl');
                }
                resolve('finish');
              })
            })
          })
        })
      })
    },
    //上一首
    preMusic(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      //先暂停播放
      this.$store.commit('changePlayState',false);
      this.$parent.$refs.audio.pause();
      //然后更改当前歌曲的索引
      let index = null;
      if(this.currentIndex == null || this.currentIndex == 0){
        index = this.musicList.length - 1;
      }else{
        index = this.currentIndex - 1; 
      }
      //然后根据索引更新歌曲信息
      this.updateMusicDetail(index).then((value) => {
        Toast.clear();
        //然后拿到更新后的歌曲时长
        this.getTotalTime();
        //最后启动播放
        this.$store.commit('changePlayState',true);
        this.$parent.$refs.audio.play();
      },null)
    },
    nextMusic(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      //先暂停播放
      this.$store.commit('changePlayState',false);
      this.$parent.$refs.audio.pause();
      //然后更改当前歌曲的索引
      let index = null;
      if(this.currentIndex == this.musicList.length - 1){
        index = 0;
      }else if(this.currentIndex == null){
        index = 1;
      }else{
        index = this.currentIndex + 1; 
      }
      //然后根据索引更新歌曲信息
      this.updateMusicDetail(index).then((value) => {
        Toast.clear();
        //然后拿到更新后的歌曲时长
        this.getTotalTime();
        //最后启动播放
        this.$store.commit('changePlayState',true);
        this.$parent.$refs.audio.play();
      },null)
    },
    //播放
    playMusic(){
      this.$store.commit('changePlayState',true);
      this.$parent.$refs.audio.play();
    },
    //暂停
    stopMusic(){
      this.$store.commit('changePlayState',false);
      this.$parent.$refs.audio.pause();
    },
  },
}
</script>
<style scoped lang='less'>
  @import '../assets/style/base.less';
  .song-detail-box{
    position: relative;
    width: 100%;
    min-height: 87vh;
    overflow: hidden;
    .img-box{
      margin-top: 40px;
      width: 100%;
      display: flex;
      justify-content: center;
      img{
        border-radius: 10px;
        border: 3px solid #fff;
        width: 300px;
        height: 300px;
      }
    }
    .song-detail{
      width: 100%;
      .song-name{
        color: #fff;
        font-weight: 700;
        width: 100%;
        padding-left: 35px;
        font-size: 30px;
        box-sizing: border-box;
      }
      // .singer-name{
      //   width: 100%;
      //   padding-left: 35px;
      //   font-size: 18px;
      //   color: #fff;
      //   font-weight: 700;
      //   position: relative;
      //   top: -25px;
      // }
    }
    .progress-bar{
      width: 85%;
      margin: 20px auto;
      margin-bottom: 12px;
    }
    .time{
      margin: 0 auto;
      width: 80%;
      display: flex;
      justify-content: space-between;
      span{
        font-size: 14px;
        color: #fff;
      }
    }
    .control-bar{
      width: 90%;
      margin: 10px auto;
      color: #fff;
      display: flex;
      justify-content: space-around;
      align-items: center;
      i{
        font-size: 30px;
      }
      .icon-zanting{
        font-size: 50px;
      }
      .icon-zanting1{
        font-size: 50px;
      }
    }
    .mask_bg{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      background-size: cover;
      background-position: 50%;
      filter: blur(35px);
      opacity: 0.5;
    }
    .mask{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      background: rgba(0, 0, 0, 0.1);
    }
  }
</style>