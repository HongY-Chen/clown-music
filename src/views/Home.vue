<template>
  <div class="home">
    <div class="home-box">
      <div class="song-box">
        <div class="search-box">
          <input type="text" v-model="query" @keyup.enter="search" class="search" placeholder="搜索一下">
          <i class="iconfont icon-sousuo"></i>
          <button class="search-btn" @click="search">搜索</button>
        </div>
        <div class="play-bar">
          歌曲总数：({{ musicList.length }})
          <i class="iconfont icon-xiazai"></i>
          <i class="iconfont icon-iconplsd"></i>
        </div>
        <ul class="song-list">
          <li v-for="(item,index) in musicList" :key="item.id" :class="{'active':currentIndex == index}" @click="playMusic(index,item.id,item.mvid)">
            <div class="song-name" >
              {{ item.name }}
            </div>
            <i v-if="!(currentIndex == index) || !isPlaying" class="iconfont icon-bofang1" @click.stop="playMusic(index,item.id,item.mvid)" ></i>
            <!-- 这里点击暂停要阻止事件冒泡 -->
            <i v-else-if="currentIndex == index && isPlaying" class="iconfont icon-zanting2" @click.stop="stop" ></i>
            <!-- 有没有Mv id为0就是没有 --> 
            <!-- 要阻止事件冒泡，否则会冒泡到li上 -->
            <i class="iconfont icon-bofangMV" v-if="item.mvid!=0" @click.stop="playMv(index,item.id,item.mvid)" ></i>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant'
export default {
  name:'Home',
  data() {
    return {
      query:"", //查询字符串
    }
  },
  computed:{
    //音乐列表
    musicList(){
      return this.$store.state.musicList;
    },
    //当前播放歌曲的地址
    currentMusicUrl(){
      return this.$store.state.currentMusicUrl;
    },
    //播放状态
    isPlaying(){
      return this.$store.state.isPlaying;
    },
    currentIndex(){
      return this.$store.state.currentIndex;
    }
  },
  //在挂载到DOM前拿到数据 避免再次操作DOM
  created() {
    // 先判断是否列表为空，是否需要初始化
    if(!this.musicList.length){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      //初始化信息 这里默认先渲染李荣浩的歌曲
      this.$store.dispatch('updateList','李荣浩').then(() => {
        this.initMusic(this.musicList[0].name,this.musicList[0].id,this.musicList[0].mvid);
        Toast.clear();
      })
    }
  },
  methods: {
    initMusic(name, id, mvid){
      //返回一个promise 以便接下来的播放操作能准确的拿到更新后的元素
      return new Promise((resolve, reject) => {
        //初始化音乐名字
        this.$store.commit('changeMusicName',name);
        //初始化音乐地址
        this.$store.dispatch('updateMusicUrl',id).then(() => {
          this.$parent.$refs.audio.src = this.currentMusicUrl;
          //初始化歌曲封面
          this.$store.dispatch('updateMusicCover',id).then(() => {
            //初始化歌词
            this.$store.dispatch('updateLyric',id).then(() => {
              //初始化歌曲热评
              this.$store.dispatch('updateHotComments',id).then(() => {
                //mvid不为0 则初始化MV地址
                if(mvid != 0){
                  this.$store.dispatch('updateMvUrl',mvid)
                }else{
                  //没有MV的话需要置空当前MV地址
                  this.$store.commit('changeCurrentMvUrl');
                }
                //返回成功
                resolve('finish');
              })
            })
          })
        })
      })
    },
    //搜索歌曲
    search(){
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
      //每次搜索后都停止当前播放的音乐，并初始化索引
      this.$parent.$refs.audio.pause();
      this.$store.commit('changeIndex',null);
      //query为空的话默认搜索李荣浩的
      if(!this.query){
        this.$store.dispatch('updateList','李荣浩').then(() => {
          this.initMusic(this.musicList[0].name,this.musicList[0].id,this.musicList[0].mvid);
        })
      }else{
        this.$store.dispatch('updateList',this.query).then(() => {
          this.query = '';
          //每次search过后需要更新一下初始化信息
          this.initMusic(this.musicList[0].name,this.musicList[0].id,this.musicList[0].mvid);
        }) 
      }
      Toast.clear();
    },

    //播放音乐
    playMusic(index, id, mvid){
      // 当前index == currentIndex 继续播放上一首,将暂停变为播放
      if(this.currentIndex == index ){
        this.$store.commit('changePlayState',true);
        this.$store.commit('changeIndex',index);
        this.$parent.$refs.audio.play();
      }else{
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
        });
        //修改index为当前音乐
        this.$store.commit('changeIndex',index);
        this.$store.commit('changePlayState',true);
        //初始化音乐信息
        this.initMusic(this.musicList[index].name, id, mvid)
        .then(() => {
          Toast.clear();
          //播放
          this.$parent.$refs.audio.play();
        })
      }
    },

    //暂停
    stop(){
      this.$store.commit('changePlayState',false);
      this.$parent.$refs.audio.pause();
    },

    //播放MV
    playMv(index, id, mvid){
      //先暂停在播放的音乐
      this.$store.commit('changePlayState',false);
      this.$parent.$refs.audio.pause();
      //然后初始化该歌曲信息
      this.initMusic(this.musicList[index].name, id, mvid)
      .then(() => {
        // 然后跳转到MV页面
        this.$router.push({ path:'/video' });
      })
    }
  },
}
</script>

<style lang="less" scoped>
  @import '../assets/style/base.less';
  .home{
    .home-box{
      width: 100%;
      display: flex;
      justify-content: center;
      background-color: steelblue;
      .song-box{
        box-sizing: border-box;
        background-color: steelblue;
        color: #fff;
        width: 90%;
        min-height: 87vh;
        overflow: hidden;
        .search-box{
          width: 100%;
          height: 40px;
          border-bottom: 1px solid #ccc;
          position: relative;
          display: flex;
          align-items: center;
          .search{
            width: 180px;
            border: 1px solid #333;
            border-radius: 5px;
            font-size: 15px;
            margin-left: 10px;
            height: 20px;
            color: #333;
          }
          .icon-sousuo{
            position: absolute;
            right: 160px;
            font-size: 18px;
            line-height: 40px;
            color: #333;
          }
          .search-btn{
            width: 50px;
            height: 60%;
            font-size: 13px;
            border: 1px solid #333;
            border-radius: 3px;
            position: absolute;
            right: 70px;
            color: #333;
            // margin-top: 4px;
          }
        }
        .play-bar{
          height: 44px;
          line-height: 44px;
          border: none;
          width: 100%;
          font-size: 16px;
          font-weight: 600;
          .icon-xiazai{
            font-size: 25px;
            position: relative;
            right: -130px;
            font-weight: 500;
          }
          .icon-iconplsd{
            font-size: 25px;
            position: relative;
            right: -150px;
            font-weight: 500;
          }
        }
        .song-list{
          margin-top: 5px;
          li{
            position: relative;
            margin-bottom: 10px;
            border-bottom: 1px solid #ccc;
            height: 35px;
            line-height: 35px;
            .song-name{
              margin-left: 5px;
              font-size: 18px;
              color: #fff;
              font-weight: 700;
              width: 200px;
              height: 100%;
              overflow: hidden;
            }
            // .singer-name{
            //   font-size: 13px;
            //   color: rgba(141, 139, 139);
            //   position: relative;
            //   left: 5px;
            // }
            .icon-bofang1{
              font-size: 30px;
              position: absolute;
              right: 110px;
              top: 0;
            }
            .icon-zanting2{
              font-size: 30px;
              position: absolute;
              right: 110px;
              top: 0px;
            }
            .icon-bofangMV{
              font-size: 30px;
              position: absolute;
              right: 50px;
              top: 0px;
            }
            &.active{
              background-color: rgba(92, 174, 241, 0.911);
            }
          }
        }
      }
    }
  }
</style>
