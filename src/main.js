import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/reset.css'
// 引入iconfont样式
import './assets/font/iconfont.css'
import './plugins/element.js'
import store from './store'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:3000'

Vue.prototype.$http = axios
// 毫秒转化为分秒
Vue.filter('toMinSecFormat', function (originVal) {
  // 252757
  let minutes = Math.floor((originVal / 1000) / 60)
  let seconds = Math.floor((originVal % (1000 * 60)) / 1000)
  return `${minutes}:${seconds}`
})
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
