import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main/Main'
import Music from '../views/music/Music'
import MusicList from '../components/Music/MusicList'
import Mv from '../views/mv/Mv'
import MvList from '../components/MV/MvList'
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
      },
      {
        path: '/main/mv',
        component: Mv
      },
      {
        name: 'mvlist',
        path: '/main/mvlist',
        component: MvList
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
