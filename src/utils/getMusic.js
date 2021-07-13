import axios  from "axios";

// export function getTest(id){
//   return axios.get("http://120.25.250.129:3000/song/url?id=" + id);
// }

//根据搜索获取音乐列表
export function getMusicList(query){
  return axios.get("http://120.25.250.129:3000/search?keywords=" + query);
}

//根据音乐Id获取音乐播放地址
export function getMusicUrl(id){
  return axios.get("http://120.25.250.129:3000/song/url?id=" + id);
}

//获取专辑封面及歌曲详情
export function getMusicDetail(id){
  return axios.get("http://120.25.250.129:3000/song/detail?ids=" + id);
}

//获取评论
export function getMusicComment(id){
  return axios.get("http://120.25.250.129:3000/comment/hot?type=0&id=" + id);
}

//获取MV地址
export function getMvUrl(mvid){
  return axios.get("http://120.25.250.129:3000/mv/url?id=" + mvid);
}

//获取歌词
export function getMusicLyric(id){
  return axios.get("http://120.25.250.129:3000/lyric?id=" + id);
}