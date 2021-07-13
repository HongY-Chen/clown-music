<template>
  <div class="video-box" v-if="hasMv">
    <video controls="controls" autoplay :src="mvUrl" class="video"></video>
    <div class="Mv-detail">
      <img :src="musicCover" class="music-cover">
      <span class="music-name">{{currentMusicName}}</span>
    </div>
    <div class="about-box">
      <p class="recommend">相关推荐</p>
      <ul>
        <li >
          <img :src="musicCover" class="music-cover">
          <span class="music-name">{{currentMusicName}}</span>
        </li>
        <li >
          <img :src="musicCover" class="music-cover">
          <span class="music-name">{{currentMusicName}}</span>
        </li>
      </ul>
    </div>
  </div>
  <div v-else class="noMv">
    <div class="content">
      <p>这首歌没有MV喔</p>
      <div>
        <i class="iconfont icon-crying"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicCover:'', //歌曲封面
      MusicName:'', //歌曲名
      mvUrl:'', //MV地址
      hasMv:false //这首歌有没有MV
    }
  },
  created() {
    //先判断有没有MV 没有MV则切换显示
    if(this.currentMvUrl != null){
      this.hasMv = true;
      this.mvUrl = this.currentMvUrl;
      this.musicCover = this.currentMusicCover;
      //MV播放时把音频的播放改为false
      this.$store.commit('changePlayState',false);
    }else{
      this.hasMv = false;
    }
  },
  mounted() {
    this.$parent.$refs.audio.pause();
  },
  computed:{
    //获取当前MV地址
    currentMvUrl(){
      return this.$store.state.currentMvUrl;
    },

    //当前在播放的歌曲专辑图片
    currentMusicCover(){
      return this.$store.state.currentMusicCover;
    },

    //当前在播放的歌曲名
    currentMusicName(){
      return this.$store.state.currentMusicName;
    },

  }
}
</script>
<style scoped lang='less'>
  @import '../assets/style/base.less';
  .video-box{
    background-color: steelblue;
    width: 100%;
    min-height: 87vh;
    .video{
      width: 100%;
    }
    .Mv-detail{
      position: relative;
      width: 100%;
      border-bottom: 1px solid rgb(241, 238, 238);
      .music-cover{
        width: 80px;
        border-radius: 10px;
        margin-left: 20px;
      }
      .music-name{
        position: absolute;
        font-size: 20px;
        font-weight: 700;
        color: #fff;
        top: 30px;
        left: 110px;
      }
    }
    .about-box{
      width: 100%;
      .recommend{
        font-size: 20px;
        margin-left: 20px;
        color: #fff;
        font-weight: 700;
      }
      li{
        width: 100%;
        position: relative;
        margin-bottom: 10px;
        .music-cover{
          width: 80px;
          border-radius: 10px;
          margin-left: 20px;
        }
        .music-name{
          position: absolute;
          font-size: 20px;
          font-weight: 700;
          color: #fff;
          top: 30px;
          left: 110px;
        }
      }
    }
  }
  .noMv{
    background-color: steelblue;
    width: 100%;
    min-height: 87vh;
    display: flex;
    justify-content: center;
    // align-items: center;
    .content{
      width: 250px;
      height: 250px;
      text-align: center;
      p{
        width: 100%;
        font-size: 30px;
        color: #fff;
        font-weight: 700;
        text-align: center;
      }
      .icon-crying{
        font-size: 50px;
        color: #fff;
      }
    }
  }
</style>