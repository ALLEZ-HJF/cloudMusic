import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/reset.css'
import './plugins/element.js'
import store from './store'
import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:3000'

Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
