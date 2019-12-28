<template>
  <div class="mvListContainer">
    <div class="newMvList" v-if="type === 'new'">
      <div class="item" v-for="(item, index) in newMvList" :key="index">
        <el-image lazy :src="item.cover+'?param=250y160'" alt="" @click="playMv(item)"></el-image>
        <div class="title">{{item.name}}</div>
        <span class="name">{{item.artistName}}</span>
      </div>
    </div>
    <div class="allMvList" v-if="type === 'all'">
      <div class="menu">
        <ul class="list">
          <li v-for="(item, index) in allMvType" :key="index">
            <a href="javascript:;" @click="getAllMvList(item)" :style="activeIndex === index ? { color: 'red' } : { color: 'black' }">{{item}}</a>
          </li>
       </ul>
      </div>
      <div class="item" v-for="(item, index) in allMvList" :key="index">
        <el-image lazy :src="item.cover+'?param=250y160'" alt="" @click="playMv(item)"></el-image>
        <div class="title">{{item.name}}</div>
        <span class="name">{{item.artistName}}</span>
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
      newMvList: [],
      allMvList: [],
      type: '',
      activeIndex: '',
      dialogVisible: false,
      videoInfo: {
        url: ''
      }
    }
  },
  created () {
    if (this.$route.params.type) {
      if (this.$route.params.type === 'new') {
        this.getNewMvList()
        this.type = 'new'
      } else {
        this.getAllMvList()
        this.type = 'all'
      }
    }
  },
  methods: {
    // 获取最新的mv
    async getNewMvList (type) {
      const { data: res } = await this.$http.get('/mv/first')
      if (res.code !== 200) {
        return this.$message.error('获取最新mv数据失败请刷新页面')
      }
      this.newMvList = res.data
    },
    // 获取全部mv
    async getAllMvList (type) {
      if (!type) {
        const { data: res } = await this.$http.get('/mv/all')
        if (res.code !== 200) {
          return this.$message.error('获取最新mv数据失败请刷新页面')
        }
        this.allMvList = res.data
      } else {
        const { data: res } = await this.$http.get(`/mv/all?area=${type}`)
        if (res.code !== 200) {
          return this.$message.error('获取最新mv数据失败请刷新页面')
        }
        this.allMvList = res.data
        this.activeIndex = this.allMvType.indexOf(type)
      }
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
<style lang="less" scoped>
video {
  width: 100%;
  height: 100%;
}
.mvListContainer {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, .7);
  .newMvList,.allMvList{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    overflow: auto;
  }
  .allMvList {
    .menu {
      width: 100%;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      li {
        float: left;
        width: 100px;
      }
    }
  }
  .item {
    width: 220px;
    height: 240px;
    margin-top: 10px;
    border-radius: 5px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, .5);
    .el-image {
      width: 220px;
      height: 170px;
      border-radius: 5px;
      cursor: pointer;
    }
    .title {
      font-size: 14px;
      cursor: pointer;
    }
    .name {
      font-size: 12px;
      color: grey;
      cursor: pointer;
    }
  }
}
</style>
