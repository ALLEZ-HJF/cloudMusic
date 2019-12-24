import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main/Main'
import Music from '../views/music/Music'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/main'
  },
  {
    path: '/main',
    component: Main,
    children: [
      {
        path: '/main/music',
        component: Music
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
