import Vue from 'vue'
import Vuex from 'vuex'
import { getMusicList, getMusicDetail, getMusicUrl, 
         getMusicComment, getMusicLyric, getMvUrl } from '../utils/getMusic'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicList:[], //音乐列表
    currentMusicUrl: '', //当前播放音乐的地址
    currentMusicCover:'', //当前音乐专辑图片
    currentMusicName:'', //当前歌曲名
    currentIndex:null, //当前歌曲在列表中的索引
    currentTime:0, //当前歌曲的播放时间
    hotComments:[], //热门评论
    currentMvUrl:null, //当前播放的MV的地址
    isPlaying:false, //是否正在播放歌曲
    lyricString:'' //返回的歌词字符串
  },
  mutations: {
    //更改播放状态
    changePlayState(state,bool){
      state.isPlaying = bool;
    },
    //更改音乐列表
    addList(state,payload){
      // console.log(payload);
      state.musicList = payload.result.songs;
    },
    //更改当前音乐索引
    changeIndex(state,index){
      state.currentIndex = index;
    },
    //更新播放时间
    updateCurrentTime(state,time){
      state.currentTime = time;
    },
    //更改播放音乐的地址
    changeMusicUrl(state,payload){
      state.currentMusicUrl = payload.data[0].url;
      // console.log(state.currentMusicUrl);
    },

    //更改专辑图片
    changeMusicCover(state,payload){
      // console.log(payload);
      state.currentMusicCover = payload.songs[0].al.picUrl;
    },

    //更新音乐名字
    changeMusicName(state,name){
      state.currentMusicName = name;
    },

    //获取热评
    getHotComments(state,payload){
      state.hotComments = payload.hotComments;
    },

    //获取MV地址
    getCurrentMvUrl(state,payload){
      state.currentMvUrl = payload.data.url;
    },

    //更改MV地址,当前歌曲没有MV的时候调用
    changeCurrentMvUrl(state){
      state.currentMvUrl = null;
    },

    //获取歌词
    getCurrentMusicLyric(state,payload){
      state.lyricString = payload.lrc.lyric;
    }
  },
  //异步请求放在这边
  actions: {
    //通过查询到的结果更新列表
    async updateList(context,query){
      const { data } = await getMusicList(query);
      context.commit('addList',data);
    },

    //更改播放音乐的地址
    async updateMusicUrl(context,id){
      const { data } = await getMusicUrl(id);
      context.commit('changeMusicUrl',data);
    },

    //更改专辑图片
    async updateMusicCover(context,id){
      const { data } = await getMusicDetail(id);
      context.commit('changeMusicCover',data);
    },

    //根据音乐ID获取热评
    async updateHotComments(context,id){
      const { data } = await getMusicComment(id);
      context.commit('getHotComments',data);
    },

    //根据MV的ID获取MV地址
    async updateMvUrl(context,mvid){
      const { data } = await getMvUrl(mvid);
      context.commit('getCurrentMvUrl',data);
    },

    //根据ID获取歌词
    async updateLyric(context,id){
      const { data } = await getMusicLyric(id);
      context.commit('getCurrentMusicLyric',data);
    }
  }
})
