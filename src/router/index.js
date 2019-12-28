import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '../components/Main/Main'
import Music from '../views/music/Music'
import MusicList from '../components/Music/MusicList'
import Video from '../views/video/Video'
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
        path: '/main/video',
        component: Video
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
