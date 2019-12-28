<template>
  <div class="controllerContainer" >
    <el-row :gutter="10">
      <el-col :span="8">
        <div class="controller">
          <div class="songImg" v-if="audioInfo.al">
            <img :src="audioInfo.al.picUrl+'?param=100y100'" alt="">
          </div>
          <div class="audioInfo" v-if="audioInfo.al">
             <div>{{audioInfo.name}}</div>
            歌手:&nbsp;<span>{{audioInfo.ar[0].name}}</span>
          </div>
          <div class="icon">
            <div class="item">
              <span class="iconfont icon-shangyishou"></span>
              <span class="iconfont icon-kaishi" @click="stopOrPlay(true)" v-if="!isPlay"></span>
              <span class="iconfont icon-zanting" @click="stopOrPlay(false)" v-else></span>
              <span class="iconfont icon-xiayishou"></span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="time">
          <span class="nowTime">当前播放时间:{{nowTime | formatNowTime}}</span>
          <div class="timeSlide">
            <span class="bg"></span>
            <span class="fg" ref="fg" :style="{ width: fgWidth + 'px' }"></span>
            <span class="item" ref="item" :style="{ left: itemLeft + 'px'}"></span>
          </div>
          <span class="totalTime" v-if="audioInfo.dt">总时间:{{audioInfo.dt | toMinSecFormat}}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="sound">
          <span class="iconfont icon-shengyin"></span>
          <div class="soundSlide">
              <span class="bg"></span>
              <span class="fg"></span>
              <span class="item"></span>
          </div>
        </div>
      <audio ref="myAudio" :src="myAudio.url" @ended="stopTiem()"></audio>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
import { mapState } from 'vuex'
export default {
  data () {
    return {
      isPlay: false,
      myAudio: {
        url: '',
        duration: ''
      },
      nowTime: 0,
      timer: '',
      isEnd: false,
      fgWidth: 0, // 前景色宽度
      itemLeft: -5 // 滑块位置
    }
  },
  created () {
  },
  mounted () {
  },
  computed: {
    ...mapState(['audioInfo', 'audioUrl'])
  },
  methods: {
    // 双击时播放执行函数
    playMusic (urlData) {
      this.myAudio.url = urlData.url
      // 先获取一秒钟走多少px  先把歌曲的毫秒转化成秒
      // 获取歌曲详情
      let time = (this.audioInfo.dt / 1000)
      let s = 300 / time
      this.$nextTick(() => {
        this.$refs.myAudio.play()
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = ''
          this.nowTime = 0
          this.nowTime = 0
        }
        this.timer = setInterval(() => {
          this.nowTime = this.nowTime + 1
          this.fgWidth = this.fgWidth + s
          this.itemLeft = this.itemLeft + s
        }, 1000)
      })
      if (!this.isPlay) {
        this.isPlay = !this.isPlay
      }
    },
    // 控制音频停止与播放
    stopOrPlay (check) { // true 播放  false 停止
      // 判断前一首歌是否已经播放完毕
      if (this.myAudio.isEnd) {
      }
      if (this.myAudio.url) {
        if (!check) {
          this.$refs.myAudio.pause()
          if (this.timer) {
            clearInterval(this.timer)
          }
        } else {
          this.$refs.myAudio.play().catch(() => {
          })
          this.timer = setInterval(() => {
            this.nowTime = this.nowTime + 1
          }, 1000)
        }
      }
      this.isPlay = !this.isPlay
    },
    // 当音乐播放完毕停止定时器
    stopTiem () {
      if (this.timer) {
        clearInterval(this.timer)
        this.myAudio.isEnd = true
        this.stopOrPlay(false)
      }
    }
  },
  filters: {
    formatNowTime: function (value) {
      let m = Math.floor(value / 60)
      let s = value % 60
      if (s < 10) {
        s = '0' + s
      }
      return `${m}:${s}`
    }
  },
  watch: {
    audioInfo (newVal) {
    },
    audioUrl (newVal) {
      this.playMusic(newVal)
    }
  }
}

</script>
<style lang="less" scoped>
@import '../../assets/css/mixin';
.controllerContainer {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 55px;
  width: 100%;
  background: rgba(255, 255, 255, .7);
  border-radius: 5px 5px 0 0;
  box-shadow: 0px -1px 5px rgba(0, 0, 0, .5);
  .el-row {
    height: 100%;
    .el-col {
      height: 100%;
      .controller {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        .songImg {
          display: block;
          width: 80px;
          height: 45px;
          border-radius: 5px;
          box-shadow: 0 0 3px black;
          img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }
        .audioInfo {
          font-size: 14px;
          div {
            margin: 5px 0;
            width: 140px;
            font-size: 14px;
            font-weight: bold;
            color: red;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }
          span {
            font-weight: bold;
            font-size: 14px;
          }
        }
        .icon {
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: center;
          .iconfont {
            margin-top: 20px;
            font-size: 30px;
            margin-left: 30px;
          }
          span {
            cursor: pointer;
          }
        }
      }
      .time {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 30px;
        line-height: 30px;
        .nowTime {
          float: left;
        }
        .timeSlide {
          float: left;
          width: 300px;
          height: 30px;
          position: relative;
          margin: 0 20px;
          .itemSlide(300px,0px,0px)
        }
        .totalTime {
          float: left;
        }
      }
      .sound {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        height: 30px;
        line-height: 30px;
        .iconfont {
          float: left;
        }
        .soundSlide {
          float: left;
          width: 150px;
          height: 30px;
          margin-left: 30px;
          position: relative;
          .itemSlide(150px,150px,150px)
        }
      }
    }
  }
}
</style>
