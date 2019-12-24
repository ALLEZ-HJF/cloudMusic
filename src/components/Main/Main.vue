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
            <li>
              <a href="javascript:;">首页</a>
            </li>
            <li>
              <router-link to="/main/music">歌曲</router-link>
            </li>
            <li>
              <a href="javascript:;">排行榜</a>
            </li>
            <li>
              <a href="javascript:;">视频</a>
            </li>
            <li>
              <a href="javascript:;">电台</a>
            </li>
          </ul>
        </nav>
        <div class="login">
          <a href="javascript:;">
            登录
          </a>
        </div>
        <div class="search">
            <input type="text" placeholder="输入歌曲名" onfocus="this.placeholder=''" onblur="this.placeholder='输入歌曲名'">
        </div>
      </div>
    </div>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>
        <div v-if="this.$route.path === '/main'" class="index">
            <div class="banner">
              <!-- <ul class="list clearfix" ref="list">
                <li v-for="(image, index) in imgs" :key="index">
                  <a href="javascript:;">
                    <img :src="image" alt="">
                  </a>
                </li>
              </ul> -->
                <div class="swiper-container">
                  <div class="swiper-wrapper">
                      <div class="swiper-slide" v-for="(image, index) in imgs" :key="index">
                        <a href="javascript:;">
                          <img :src="image" alt="">
                        </a>
                      </div>
                  </div>
                  <div class="swiper-pagination"></div>
                  <div class="swiper-button-prev"></div>
                  <div class="swiper-button-next"></div>
              </div>
            </div>
        </div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script type="text/ecmascript-6">
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
export default {
  data () {
    return {
      imgs: [
        'http://www.ysc66.com/Uploads//banner/2017-10-31/59f7f3a334aeb_1920x500.png',
        'http://www.ysc66.com/Public/Home/images/infomation/banner.png',
        'http://www.ysc66.com/Uploads//banner/2017-11-10/5a054c1c9376b_1920x500.png'
      ]
    }
  },
  mounted () {
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
  background-color: #f34343;
}
.el-main {
  padding-top: 70px;
  background-color: #f5f0f0;
  overflow: hidden;
}
.head {
    position: absolute;
    height: 70px;
    width: 100%;
    background: #383838;
    .content{
      height: 100%;
      padding: 0px 50px;
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
  margin-top: 5px;
   .banner {
     margin: 0 auto;
     .swiper-container {
       width: 900px;
       height: 300px;
       box-shadow: 2px 2px 2px gray;
       .swiper-slide  img {
         width: 900px;
         height: 300px;
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
}
</style>
