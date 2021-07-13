<template>
  <div id="app">
    <audio src="" ref="audio" @timeupdate="updateTime"></audio>
    <nav-bar :title="'沙口音乐'"></nav-bar>
    <div class="content">
      <router-view class="router-view" />
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue'
export default {
  components:{
    NavBar
  },
  methods: {
    //用于更新当前的播放时间，否则拿不到响应式数据
    updateTime(){
      this.$store.commit('updateCurrentTime',this.$refs.audio.currentTime);
    }
  },
}
</script>

<style lang="less">
  .content{
    width: 100%;
    position: relative;
    margin-top: 98px;
    .router-view{
        width: 100%;
        height: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        margin: 0 auto;
        -webkit-overflow-scrolling: touch;
    }
  }
</style>
