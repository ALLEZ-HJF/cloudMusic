<template>
  <div class="mainContainer">
     <div class="head">
      <div class="content">
        <h1 class="logo">
          <a href="#">
            <img src="../../assets/logo.png" alt="">
          </a>
        </h1>
        <nav class="menu">
          <ul class="list">
            <li :class="{active: $route.path === '/main'}">
              <a href="javascript:;" @click="$router.push({ path: '/', query: { time: new Date().getTime() } })">首页</a>
            </li>
            <li :class="{active: $route.path === '/main/music'}">
              <a href="javascript:;" @click="$router.push({ path: '/main/music', query: { time: new Date().getTime() } })">歌单</a>
            </li>
            <li :class="{active: $route.path === '/main/order'}">
              <a href="javascript:;" @click="$message.info('暂未开发,过段时间再来吧或许不开发了,谢谢捧场!')">排行榜</a>
            </li>
            <li :class="{active: $route.path === '/main/mv'}">
              <a href="javascript:;" @click="$router.push({ path:'/main/mv', query: { time: new Date().getTime() }})">MV</a>
            </li>
            <li :class="{active: $route.path === '/main/fm'}">
              <a href="javascript:;" @click="$message.info('暂未开发,过段时间再来吧或许不开发了,谢谢捧场!')">电台</a>
            </li>
          </ul>
        </nav>
        <div class="login">
          <a href="javascript:;" @click="$message.info('暂未开发')">
            登录
          </a>
        </div>
        <div class="search">
            <input type="text" v-model="keywords" placeholder="输入歌曲名" onfocus="this.placeholder=''" onblur="this.placeholder='输入歌曲名'">
            <span class="searchIcon el-icon-search" @click="gotoMusicList()"></span>
        </div>
      </div>
    </div>
    <el-container>
      <el-aside width="150px">Aside</el-aside>
      <el-main>
        <div v-if="this.$route.path === '/main'" class="index">
            <div class="banner" v-if="indexBanner.banners">
                <div class="swiper-container">
                  <div class="swiper-wrapper">
                      <div class="swiper-slide" v-for="(item, index) in indexBanner.banners" :key="index">
                        <a href="javascript:;">
                          <img :src="item.imageUrl+'?param=1200y400'" alt="">
                        </a>
                      </div>
                  </div>
                  <div class="swiper-pagination"></div>
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-button-next"></div>
                </div>
            </div>
            <!-- 推荐歌单 -->
            <div class="content" ref="content">
              <el-row :gutter="5">
                 <el-col :span="8">
                   <el-card :body-style="cardStyle">
                     <span class="title">推荐mv</span>
                     <div class="itemContent">
                       <div class="item" v-for="(item, index) in personalizedMv" :key="index" @click="playMv(item)">
                         <el-image
                              lazy
                              :src="item.picUrl+'?param=100y100'"
                              fit="fill">
                          </el-image>
                         <div class="text"><a href="javascript:;">{{item.copywriter}}</a></div>
                       </div>
                     </div>
                   </el-card>
                 </el-col>
                 <el-col :span="8">
                   <el-card :body-style="cardStyle">
                      <span class="title">推荐歌单</span>
                      <div class="itemContent">
                       <div class="item" v-for="(item, index) in personalized" :key="index" @click="gotoPlayList(item)">
                         <el-image
                              lazy
                              :src="item.picUrl+'?param=100y100'"
                              fit="fill">
                          </el-image>
                         <div class="text"><a href="javascript:;">{{item.name}}</a></div>
                       </div>
                     </div>
                   </el-card>
                 </el-col>
                 <el-col :span="8">
                   <el-card :body-style="cardStyle">
                     <span class="title">推荐新音乐</span>
                     <div class="itemContent">
                       <div class="item" v-for="(item, index) in personalizedNewsong" :key="index" @click="gotoPlayList(item,true)">
                         <el-image
                              lazy
                              :src="item.picUrl+'?param=100y100'"
                              fit="fill">
                          </el-image>
                         <div class="text"><a href="javascript:;">{{item.name}}</a></div>
                       </div>
                     </div>
                   </el-card>
                 </el-col>
               </el-row>
            </div>
        </div>
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>
    </el-container>
    <MusicController/>
    <el-dialog
    title="播放mv"
    :visible.sync="dialogVisible"
    width="50%" @close="mvDialogClose">
    <video :src="this.videoInfo.url" ref="myVideo" controls></video>
  </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import MusicController from '../Music/MusicController'
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import { mapState } from 'vuex'
export default {
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      keywords: '',
      bannerArr: [],
      // 卡片内部样式
      cardStyle: {
        padding: '0px',
        width: '100%',
        height: '100%',
        background: '#eee'
      },
      // 推荐mv
      personalizedMv: [],
      // 推荐歌单
      personalized: [],
      personalizedNewsong: [],
      isRouterAlive: true,
      dialogVisible: false,
      videoInfo: {
        url: ''
      }
    }
  },
  created () {
    // 推荐mv
    this.getPersonalizedMv()
    // 推荐歌单
    this.getPersonalized()
    this.getPersonalizedNewsong()
  },
  mounted () {
    setTimeout(() => {
      this.$nextTick(() => {
        /* eslint-disable no-new */
        new Swiper('.swiper-container', {
          speed: 1000,
          autoplay: {
            disableOnInteraction: false
          },
          loop: true,
          pagination: {
            el: '.swiper-pagination'
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
          }
        })
      })
    }, 500)
  },
  methods: {
    async getPersonalizedMv () {
      const { data } = await this.$http.get('/personalized/mv')
      if (data.code === 200) {
        this.personalizedMv = data.result
      }
    },
    async getPersonalized () {
      const { data } = await this.$http.get('/personalized')
      if (data.code === 200) {
        this.personalized = data.result
      }
    },
    async getPersonalizedNewsong () {
      const { data } = await this.$http.get('/personalized/newsong')
      if (data.code === 200) {
        this.personalizedNewsong = data.result
      }
    },
    // 查询歌曲
    gotoMusicList () {
      let keywords = this.keywords
      if (this.keywords) {
        let time = new Date().getTime()
        this.$router.push({ path: '/main/musiclist', query: { keywords, time } })
      } else {
        this.$message.warning({
          showClose: true,
          message: '请输入歌曲名字',
          type: 'wraning'
        })
      }
    },
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    // 播放mv
    async playMv (item) {
      // 根据id获取mv详细信息
      const { data: res } = await this.$http.get(`/mv/detail?mvid=${item.id}`)
      if (res.code !== 200) {
        return this.$message.error('获取mv视频数据失败,请重新')
      }
      let arrObj = res.data.brs
      let url = ''
      for (const key in arrObj) {
        if (arrObj.hasOwnProperty(key)) {
          if (key === '480') {
            url = arrObj[key]
            break
          } else {
            url = arrObj[key]
          }
        }
      }
      this.videoInfo.url = url
      this.dialogVisible = true
    },
    // 关闭dialog
    mvDialogClose () {
      if (!this.$refs.myVideo.paused) {
        this.$refs.myVideo.pause()
      }
      this.dialogVisible = false
    },
    gotoPlayList (item, type) {
      if (!type) {
        this.$router.push({ path: '/main/musiclist',
          query: { id: item.id }
        })
      } else {
        this.$router.push({ path: '/main/musiclist',
          query: { keywords: item.name }
        })
      }
    }
  },
  computed: {
    ...mapState(['indexBanner'])
  },
  components: {
    MusicController
  }
}

</script>
<style lang="less" scoped>
.mainContainer{
  height: 100%;
}
.el-container{
  height: 100%;
}
.el-aside {
  padding-top: 70px;
  height: 100%;
  background-color: #f13d3d;
}
.el-main {
  background-color: #e24343;
  overflow: hidden;
  padding: 70px 0;
}
.head {
    position: absolute;
    height: 70px;
    width: 100%;
    background: #383838;
    .content{
      padding: 0px 50px;
      height: 100%;
      // logo
      .logo{
        float: left;
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
        }
      }
      // 菜单栏
      .menu{
        float: left;
        height: 100%;
        margin-left: 50px;
        .list{
          height: 100%;
          text-align: center;
          li{
            float: left;
            line-height: 70px;
            width: 110px;
            height: 100%;
            margin-left: 5px;
            &:hover{
              background-color: #484848;
              transition: .5s background-color;
            }
            &.active{
              background-color: #484848;
            }
          }
        }
      }
      // 搜索栏
      .search{
        float: right;
        height: 100%;
        width: 250px;
        margin-right: 50px;
        position: relative;
        input{
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          width: 250px;
          height: 28px;
          border-radius: 20px;
          text-indent: 10px;
        }
        .searchIcon {
          position: absolute;
          font-weight: bold;
          color: red;
          font-size: 16px;
          right: 10px;
          top: 27px;
          cursor: pointer;
        }
      }
      // 登录按钮
      .login{
        float: right;
        width: 80px;
        height: 100%;
        text-align: center;
        a{
          height: 100%;
          line-height: 70px;
          &:hover{
            background-color: #484848;
            transition: .5s background-color;
          }
        }
      }
    }
  }
  @media screen and (max-width: 1170px) and (min-width: 992px) {
    .head {
      .content{
        padding: 0 30px;
        .menu{
          margin-left: 35px;
          .list{
            li{
              width: 90px;
            }
          }
        }
        .search{
          width: 200px;
          margin-right: 20px;
          input{
            width: 200px;
          }
        }
        .login{
          width: 60px;
        }
      }
    }
}
@media screen and (max-width: 992px) and (min-width: 768px) {
    .head {
      .content{
        padding: 0 15px;
        .menu{
          margin-left: 20px;
          .list{
            li{
              width: 70px;
            }
          }
        }
        .search{
          width: 200px;
          margin-right: 25px;
          input{
            width: 200px;
          }
        }
        .login{
          width: 40px;
        }
      }
    }
}
@media screen and (max-width: 768px) {
    .head {
      .content{
        padding: 0 15px;
        .menu{
          display: none;
        }
        .search{
          width: 250px;
          margin-right: 30px;
          input{
            width: 250px;
          }
        }
        .login{
          width: 40px;
        }
      }
    }
}
// 首页
.index {
  height: 100%;
  width: 100%;
  margin-top: 5px;
  position: relative;
   .banner {
     margin: 0 auto;
     height: 45%;
     .swiper-container {
       width: 80%;
       height: 100%;
       box-shadow: 2px 2px 2px gray;
       position: relative;
       .swiper-slide  img {
         position: absolute;
         width: 100%;
         height: 100%;
       }
       .swiper-button-prev {
         color: red;
         &::after{
           font-size: 60px;
         }
       }
       .swiper-button-next {
         color: red;
         &::after{
           font-size: 60px;
         }
       }
     }
   }
   .content {
     width: 100%;
     height: 55%;
     .el-row {
       height: 100%;
       .el-col {
         height: 100%;
         .el-card {
           height: 100%;
           margin: 5px;
           border-radius: 10px;
           .itemContent {
             width: 100%;
             height: 100%;
             overflow: auto;
             .item {
               width: 100%;
               height: 80px;
               padding: 0px 5px;
               border-top: 1px solid #ddd;
               cursor: pointer;
               .el-image {
                 float: left;
                 width: 30%;
                 height: 70px;
                 border-radius: 5px;
                 margin-top: 5px;
                 &:hover {
                   box-shadow: 1px 1px 1px gray;
                   transition: 1s box-shadow;
                 }
               }
               .text{
                 float: right;
                 height: 100%;
                 width: 70%;
                 text-align: center;
                 a{
                   margin-top: 20px;
                   color: black;
                   font-size: 12px;
                 }
               }
             }
           }
           .title {
             color: rgb(54, 54, 54);
             font-size: 18px;
             font-weight: bold;
           }
         }
       }
     }
   }
}
</style>
