<template>
  <div class="Lyric-page">
    <div class="Lyric-box">
      <p class="music-name">{{musicName}}</p>
      <scroll class="lyric-wrapper" :data="currentLyric.lines" ref="lyricList">
        <div class="lyric">
          <p 
            v-for="(line,index) in currentLyric.lines" 
            class="text" 
            :class="{'current':currentLineNum == index}"
            ref="lyricLine"
          >
            {{line.txt}}
          </p>
        </div>
      </scroll>
    </div>
  </div>
</template>

<script>
import Lyric from '../utils/lyric-parser';
import Scroll from '../components/Scroll.vue';

export default {
  components: { Scroll },
  data() {
    return {
      currentLyric:null, //lyric-paser对象
      currentLineNum:null //当前播放行的歌词
    }
  },
  created() {
    // console.log(this.lyricString);
    //创建lyric-paser对象
    this.currentLyric = new Lyric(this.lyricString,this.hanlder);
    // console.log(this.currentLyric);
  },
  mounted() {
    //拿到当前播放的秒数，然后跳转到该歌词
    this.currentLyric.seek(this.$parent.$refs.audio.currentTime * 1000);
    //当前是播放状态才播放歌词
    if(!this.isPlaying){
      this.currentLyric.stop();
    }
  },
  computed:{
    //全部歌词
    lyricString(){
      return this.$store.state.lyricString;
    },
    //歌曲名
    musicName(){
      return this.$store.state.currentMusicName;
    },
    //播放状态
    isPlaying(){
      return this.$store.state.isPlaying;
    }
  },
  methods: {
    //lyric-paser对象的回调函数
    hanlder({lineNum,txt}){
      // 行数改变了就赋值 
      this.currentLineNum = lineNum;
      // 行数大于4了才进行滚动 保持歌词显示在屏幕中间
      if(lineNum > 4){
        //大于4了 然后开始滚动
        //调试了一下 发现从当前上面三条开始滚比较好看
        let lineEl = this.$refs.lyricLine[lineNum - 3];
        // 参数：滚动到的DOM，滚动时间
        // 拿到dom才滚动，有可能不在当前页面
        if(this.$refs.lyricList){
          this.$refs.lyricList.scrollToElement(lineEl,1000);
        }
      }
    }
  },
}
</script>
<style scoped lang='less'>
  .Lyric-page{
    min-height: 87vh;
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: steelblue;
    .Lyric-box{
      width: 100%;
      .music-name{
        // position: fixed;
        margin-top: 20px;
        margin-bottom: 20px;
        width: 100%;
        font-size: 26px;
        text-align: center;
        color: #fff;
        font-weight: 700;
        z-index: 1000;
      }
      .lyric-wrapper{
        width: 100%;
        max-height: 70vh;
        min-height: 70vh;
        overflow: hidden;
        .lyric{
          width: 100%;
          color: #fff;
          .text{
            width: 100%;
            text-align: center;
            font-size: 18px;
            font-weight: 600;
          }
          .current{
            font-size: 20px;
            color: rgb(222, 225, 228);
            text-shadow: 0 0 4px rgb(142, 145, 145);
          }
        }
      }
    }
  }
</style>