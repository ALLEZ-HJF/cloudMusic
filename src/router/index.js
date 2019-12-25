import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main/Main'
import Music from '../views/music/Music'
import MusicList from '../components/MusicList/MusicList'
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
      },
      {
        path: '/main/musiclist',
        component: MusicList
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
