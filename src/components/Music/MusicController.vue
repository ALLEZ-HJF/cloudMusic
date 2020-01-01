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
        <div class="time" ref="time">
          <span class="nowTime">当前播放时间:{{nowTime | formatNowTime}}</span>
          <div class="timeSlide" ref="slide">
            <span class="fg" ref="fg" :style="{ width: timeFgWidth + 'px' }"></span>
            <span class="item" ref="item" :style="{ left: timeItemLeft + 'px'}"></span>
            <span class="bg" ref="bg"></span>
          </div>
          <span class="totalTime" v-if="audioInfo.dt">总时间:{{audioInfo.dt | toMinSecFormat}}</span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="sound">
          <span :class="['iconfont',soundState ? 'icon-shengyin' : 'icon-jingyin']" @click="isMute(soundState)"></span>
          <div class="soundSlide" ref="soundSilde">
              <span class="fg" ref="soundFg" :style="{ width: soundFgWidth + 'px' }"></span>
              <span class="item" ref="soundItem" :style="{ left: soundItemLeft + 'px' }"></span>
              <span class="bg"></span>
          </div>
        </div>
      <audio ref="myAudio" :src="myAudio.url" @ended="stopTiem()" @stalled="pause()"></audio>
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
        duration: '',
        volume: 1
      },
      nowTime: 0,
      timer: '',
      isEnd: false,
      timeFgWidth: 0, // 播放进度控制前景色宽度
      timeItemLeft: -5, // 播放进度控制滑块位置
      s: 0,
      soundFgWidth: 100,
      soundItemLeft: 95,
      soundState: true // 控制音量图标切换
    }
  },
  created () {
  },
  mounted () {
    this.controlAudioTime()
    this.controlAudioVolume()
  },
  computed: {
    ...mapState(['audioInfo', 'audioUrl'])
  },
  methods: {
    // 禁音
    isMute (flag) {
      this.soundState = !this.soundState
      if (flag) {
        this.soundItemLeft = -5
        this.soundFgWidth = 0
        this.$refs.myAudio.volume = 0
      } else {
        this.soundItemLeft = 95
        this.soundFgWidth = 100
        this.$refs.myAudio.volume = 1
      }
    },
    // 控制播放音量
    controlAudioVolume () {
      let startX = 0
      let mouseStartX = 0
      this.$refs.soundItem.onmousedown = (ev) => {
        ev = ev || event
        startX = this.$refs.soundItem.offsetLeft
        mouseStartX = ev.pageX
        this.$refs.soundSilde.onmousemove = (ev) => {
          ev = ev || event
          if (this.soundFgWidth >= 0 && this.soundFgWidth <= 100) {
            this.soundFgWidth = ev.pageX - mouseStartX + startX + 5
          } else {
            if (this.soundFgWidth > 100) {
              this.soundFgWidth = 100
            }
            if (this.soundFgWidth < 0) {
              this.soundFgWidth = 0
            }
          }
          if (this.soundItemLeft >= -5 && this.soundItemLeft <= 95) {
            this.soundItemLeft = ev.pageX - mouseStartX + startX
          } else {
            if (this.soundItemLeft > 95) {
              this.soundItemLeft = 95
              this.$refs.soundSilde.onmousemove = null
              this.$refs.soundSilde.onmouseup = null
            }
            if (this.soundItemLeft < -5) {
              this.soundItemLeft = -5
              this.$refs.soundSilde.onmousemove = null
              this.$refs.soundSilde.onmouseup = null
            }
          }
        }
        this.$refs.soundSilde.onmouseup = (ev) => {
          ev = ev || event
          this.$refs.myAudio.volume = this.soundFgWidth / 100
          if (this.$refs.myAudio.volume === 0) {

          }
          this.$refs.soundSilde.onmousemove = null
          this.$refs.soundSilde.onmouseup = null
        }
      }
    },
    // 控制播放时间
    controlAudioTime () {
      // 布局原因无法获取小圆点的offsetleft
      let startX = 0
      let mouseStartX = 0
      this.$refs.item.onmousedown = (ev) => {
        ev = ev || event
        startX = this.$refs.item.offsetLeft
        mouseStartX = ev.pageX
        if (this.myAudio.url) {
          this.stopOrPlay(false)
        }
        this.$refs.slide.onmousemove = (ev) => {
          ev = ev || event
          if (this.timeFgWidth >= 0 && this.timeFgWidth <= 300) {
            this.timeFgWidth = ev.pageX - mouseStartX + startX + 5
          } else {
            if (this.timeFgWidth > 300) {
              this.timeFgWidth = 300
            }
            if (this.timeFgWidth < 0) {
              this.timeFgWidth = 0
            }
          }
          if (this.timeItemLeft >= -5 && this.timeItemLeft <= 295) {
            this.timeItemLeft = ev.pageX - mouseStartX + startX
          } else {
            if (this.timeItemLeft > 295) {
              this.timeItemLeft = 295
              this.$refs.slide.onmousemove = null
              this.$refs.slide.onmouseup = null
            }
            if (this.timeItemLeft < -5) {
              this.timeItemLeft = -5
              this.$refs.slide.onmousemove = null
              this.$refs.slide.onmouseup = null
            }
          }
        }
        this.$refs.slide.onmouseup = (ev) => {
          ev = ev || event
          if (this.myAudio.url) {
            this.stopOrPlay(true)
            let time = this.timeFgWidth / 300 // 0 - 1
            this.$refs.myAudio.currentTime = this.$refs.myAudio.duration * time
            this.nowTime = Math.floor(this.$refs.myAudio.duration * time)
          }
          this.$refs.slide.onmousemove = null
          this.$refs.slide.onmouseup = null
        }
      }
    },
    // 双击时播放执行函数
    playMusic (urlData) {
      // 播放歌曲时先判断上一首的定时器是否已经关闭
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.myAudio.url = urlData.url
      // 先获取一秒钟走多少px  先把歌曲的毫秒转化成秒
      // 获取歌曲详情
      this.timeFgWidth = 0
      this.timeItemLeft = -5
      this.$nextTick(() => {
        this.$refs.myAudio.play()
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = ''
          this.nowTime = 0
        }
        this.timer = setInterval(() => {
          this.nowTime = this.nowTime + 1
          this.timeFgWidth = this.timeFgWidth + this.s
          this.timeItemLeft = this.timeItemLeft + this.s
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
            this.timeFgWidth = this.timeFgWidth + this.s
            this.timeItemLeft = this.timeItemLeft + this.s
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
      let time = (newVal.dt / 1000)
      this.s = 300 / time
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
        font-size: 14px;
        .nowTime {
          float: left;
          margin-right: 20px;
        }
        .timeSlide {
          float: left;
          width: 300px;
          height: 30px;
          position: relative;
          .itemSlide(300px,0px,0px)
        }
        .totalTime {
          margin-left: 20px;
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
          .itemSlide(100px,0px,0px)
        }
      }
    }
  }
}
</style>
