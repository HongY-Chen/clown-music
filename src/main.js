import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { Toast, Progress } from 'vant'
import 'amfe-flexible'


Vue.config.productionTip = false
Vue.use(Toast).use(Progress)

Vue.config.productionTip //阻止启动生产消息

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
