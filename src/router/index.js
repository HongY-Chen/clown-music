import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Detail from '../views/Detail.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'root',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'home',
    component: Home,
  },
  {
    path: '/detail',
    name: 'detail',
    component: () => import('../views/Detail.vue'),
  },
  {
    path: '/lyric',
    name: 'lyric',
    component: () => import('../views/Lyric.vue'),
  },
  {
    path: '/comment',
    name: 'comment',
    component: () => import('../views/Comment.vue'),
  },
  {
    path: '/video',
    name: 'video',
    component: () => import('../views/Video.vue'),
  },
  
]

const router = new VueRouter({
  routes
})

export default router
