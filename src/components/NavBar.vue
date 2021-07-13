<template>
  <div class="nav-bar">
    <div class="header">
      <i class="iconfont icon-icon-user"></i>
      <div class="header-title">
        {{ title }}
      </div>
      <i class="iconfont icon-gengduo"></i>
    </div>
    <ul class="nav-list">
      <router-link tag="li" class="nav-list-item active" to="home">
        <span>歌曲</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="detail">
        <span>详情</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="lyric">
        <span>歌词</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="comment">
        <span>评论</span>
      </router-link>
      <router-link tag="li" class="nav-list-item" to="video">
        <span>视频</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name:'',
  props:{
    //从外部传入title
    title:{
      type:String,
      default:''
    }
  }
}
</script>
<style scoped lang='less'>
  @import '../assets/style/base.less';
  .nav-bar{
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      // padding: 6px 0;
      z-index: 1000;
      background-color: @primary;
      .header{
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
        width: 100%;
        height: 44px;
        line-height: 44px;
        padding: 0 10px;
        box-sizing: border-box;
        color: #fff;
        background-color: @primary;
        // border-bottom: 1px solid #dcdcdc;
        .header-title{
          font-size: 20px;
          font-weight: 700;
        }
        .icon-icon-user{
          font-size: 20px;
        }
        .icon-gengduo{
          font-size: 20px;
        }
      }
      .nav-list {
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        padding-bottom: 15px;
        box-sizing: border-box;
        padding-top: 20px;
        margin-top: 44px;
        .nav-list-item {
          display: flex;
          flex: 1;
          flex-direction: column;
          text-align: center;
          color: rgb(73, 72, 72);
          &.router-link-active {
            color: #fff;
          }
          span{
            font-size: 16px;
            font-weight: 700;
          }
        }
      }
    }
</style>