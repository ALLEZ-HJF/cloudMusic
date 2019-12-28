<template>
  <div class="mvContainer">
    <div class="newMVContainer">
      <div class="allMVMenu">
        <h3>最新MV</h3>
        <a href="javascript:;" @click="gotoNewMvList">更多</a>
      </div>
      <div class="content">
        <div class="centerBox">
          <div class="item" v-for="(item, index) in newMvList" :key="index">
            <img :src="item.cover+'?param=250y160'" alt="" @click="playMv(item)">
            <div class="title">{{item.name}}</div>
            <span class="name">{{item.artistName}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="allMVContainer">
      <div class="allMVMenu">
        <h3>全部MV</h3>
        <ul class="list">
          <li v-for="(item, index) in allMvType" :key="index">
            <a href="javascript:;" @click="getAllMvList(item)" :style="activeIndex === index ? { color: 'red' } : { color: 'black' }">{{item}}</a>
          </li>
        </ul>
        <a href="javascript:;" class="more" @click="gotoMoreAllMvList">更多</a>
      </div>
      <div class="content">
        <div class="centerBox">
          <div class="item" v-for="(item, index) in allMvList" :key="index">
            <img :src="item.cover+'?param=250y160'" alt="" @click="playMv(item)">
            <div class="title">{{item.name}}</div>
            <span class="name">{{item.artistName}}</span>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
    title="播放mv"
    :visible.sync="dialogVisible"
    width="50%" @close="mvDialogClose">
    <video :src="this.videoInfo.url" ref="myVideo" controls></video>
  </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      allMvType: ['内地', '港台', '欧美', '日本', '韩国'],
      newMvList: [], // 存放最新mv数据
      allMvList: [], // 存放全部mv数据
      activeIndex: '0',
      dialogVisible: false,
      videoInfo: {
        url: ''
      }
    }
  },
  created () {
    this.getNewMvList()
    this.getAllMvList()
  },
  mounted () {
  },
  methods: {
    // 获取最新的mv
    async getNewMvList (type) {
      if (!type) {
        const { data: res } = await this.$http.get('/mv/first?limit=5')
        if (res.code !== 200) {
          return this.$message.error('获取最新mv数据失败请刷新页面')
        }
        this.newMvList = res.data
      } else {
      }
    },
    // 获取全部mv
    async getAllMvList (type) {
      if (!type) {
        const { data: res } = await this.$http.get('/mv/all?limit=5')
        if (res.code !== 200) {
          return this.$message.error('获取最新mv数据失败请刷新页面')
        }
        this.allMvList = res.data
      } else {
        const { data: res } = await this.$http.get(`/mv/all?area=${type}&limit=5`)
        if (res.code !== 200) {
          return this.$message.error('获取最新mv数据失败请刷新页面')
        }
        this.allMvList = res.data
        this.activeIndex = this.allMvType.indexOf(type)
      }
    },
    gotoMoreAllMvList () {
      this.$router.push({ name: 'mvlist',
        params: { type: 'all' }
      })
    },
    gotoNewMvList () {
      this.$router.push({ name: 'mvlist',
        params: { type: 'new' }
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
    }
  }
}

</script>
<style lang="less">
video {
  height: 100%;
  width: 100%;
}
.mvContainer {
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, .7);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: auto;
  .newMVContainer {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .allMVContainer {
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  // 公用menu
  .allMVMenu {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    overflow: hidden;
    .list {
      li {
        float: left;
        width: 100px;
      }
    }
    a {
      color: black;
      font-size: 14px;
    }
  }
  .content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  .centerBox {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .item {
      display: flex;
      flex-direction: column;
      width: 250px;
      height: 230px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .5);
      margin: 5px;
      img {
        width: 250px;
        height: 160px;
        cursor: pointer;
      }
      .title {
        width: 250px;
        font-size: 14px;
        margin: 5px 0;
        cursor: pointer;
      }
      .name {
        font-size: 12px;
        color: gray;
        margin-bottom: 5px;
        cursor: pointer;
      }
    }
  }
}
}
</style>
