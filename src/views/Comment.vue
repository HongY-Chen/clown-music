<template>
  <div class="Comment-box">
    <div class="music-detail">
      <img :src="musicCover" class="music-cover" >
      <span class="music-name">{{currentMusicName}}</span>
    </div>
    <p class="title">精彩评论</p>
    <div class="hot-comment">
      <scroll :data="hotComments" class="comment-wrapper">
        <ul>
          <li v-for="(item,index) in hotComments" :key="index">
            <img :src="item.user.avatarUrl" class="head-photo">
            <span class="user-name">{{ item.user.nickname }}</span>
            <p class="comment">{{ item.content }}</p>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import Scroll from '../components/Scroll.vue';
export default {
  components: { Scroll },
  data() {
    return {
      musicCover:'', //音乐封面
    }
  },
  created() {
    //每次进入页面都要重新渲染一下信息
    this.musicCover = this.currentMusicCover;
  },
  computed:{
    //热评列表
    hotComments(){
      return this.$store.state.hotComments;
    },
    //当前音乐专辑图片
    currentMusicCover(){
      return this.$store.state.currentMusicCover;
    },
    //当前歌曲名
    currentMusicName(){
      return this.$store.state.currentMusicName;
    },
  },
}
</script>
<style scoped lang='less'>
  @import '../assets/style/base.less';
  .Comment-box{
    background-color: steelblue;
    width: 100%;
    min-height: 87vh;
    // overflow: hidden;
    .music-detail{
      position: relative;
      width: 100%;
      padding-top: 20px;
      box-sizing: border-box;
      .music-cover{
        width: 80px;
        height: 80px;
        border-radius: 10px;
        margin-left: 20px;
      }
      .music-name{
        font-size: 18px;
        font-weight: 700;
        color: #fff;
        position: absolute;
        top: 33px;
        left: 110px;
      }
    }
    .title{
      font-size: 20px;
      font-weight: 700;
      color: #fff;
      margin-left: 20px;
    }
    .hot-comment{
      width: 100%;
      background-color: steelblue;
      .comment-wrapper{
        width: 100%;
        min-height: 56vh;
        max-height: 56vh;
        overflow: hidden;
      }
      ul{
        width: 100%;
        li{
          width: 100%;
          margin-left: 20px;
          margin-bottom: 5px;
          position: relative;
          .head-photo{
            width: 40px;
            height: 40px;
            border-radius: 50%;
          }
          .user-name{
            font-size: 14px;
            // font-weight: 600;
            color: #ccc;
            margin-left: 10px;
            position: absolute;
            top: 5px;
          }
          .comment{
            width: 75%;
            font-size: 16px;
            color: #fff;
            position: relative;
            left: 50px;
            top: -30px;
          }
        }
      }
    }
  }
</style>