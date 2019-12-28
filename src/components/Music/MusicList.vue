<template>
  <div class="musicListContainer">
    <div class="musicListInfo" v-if="!keywords">
      <el-button icon="el-icon-back" size="mini" @click="$router.back()">返回</el-button>
      <div class="playList">
        <div class="playListInfoImg">
          <img :src="this.playListInfo.coverImgUrl+'?param=300y300'" alt="">
        </div>
        <div class="PlayInfoContent">
          <div class="titleBox">
            <h3>{{this.playListInfo.name}}</h3>
            <span>歌曲数{{this.playListInfo.trackCount}}</span>
            <span>播放量{{this.playListInfo.playCount}}</span>
          </div>
          <div class="creatUserInfo" v-if="this.playListInfo.creator">
            <img :src="this.playListInfo.creator.avatarUrl+'?param=50y50'" alt="">
            <span>{{this.playListInfo.creator.nickname}}</span>
            <span>创建于{{this.playListInfo.createTime | dateFormat}}</span>
          </div>
          <div class="desc">
            {{this.playListInfo.description}}
          </div>
        </div>
      </div>
    </div>
    <div :class="['tableList', { 'keyword': keywords }]">
      <el-card :body-style="{height: '100%',padding: '0'}">
        <!-- 搜索歌曲列表 -->
        <el-table v-if="keywords" :data="musicListData" lazy border style="width: 100%" max-height="600px" highlight-current-row @expand-change="expandChange" @row-dblclick="playMusic">
          <el-table-column type="index"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="mvContainer" v-if="scope.row.mvid">
               <video class="mvVideo" controls :src="videoUrl"></video>
              </div>
              <p v-else>该歌曲暂无mv视频,了解歌手信息请点击歌手姓名</p>
            </template>
          </el-table-column>
          <el-table-column prop="artists[0].name" label="歌手" width="180"></el-table-column>
          <el-table-column prop="name" label="歌曲名" width="180">
            <template slot-scope="scope">
              <span>{{scope.row.name}}</span>
              <span class="el-icon-video-camera" v-if="scope.row.mvid" ></span>
            </template>
          </el-table-column>
          <el-table-column prop="album.name" label="专辑"></el-table-column>
          <el-table-column label="时间">
            <template slot-scope="scope">
              {{scope.row.duration | toMinSecFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <span class="el-icon-download"></span>
              <span class="el-icon-star-off"></span>
            </template>
          </el-table-column>
        </el-table>
        <div v-if="!keywords">
          <!-- 歌单歌曲列表 -->
        <el-table :data="playListInfo.tracks" lazy border style="width: 100%;max-height: 400px;overflow: auto"  highlight-current-row @expand-change="expandChange" @row-dblclick="playMusic">
          <el-table-column type="index"></el-table-column>
          <el-table-column type="expand">
            <template slot-scope="scope">
              <div class="mvContainer" v-if="scope.row.mv">
                <video class="mvVideo" controls :src="videoUrl"></video>
              </div>
               <p v-else>该歌曲暂无mv视频,了解歌手信息请点击歌手姓名</p>
            </template>
          </el-table-column>
          <el-table-column prop="ar[0].name"  label="歌手" width="180"></el-table-column>
          <el-table-column label="歌名">
            <template slot-scope="scope">
              {{scope.row.name}}
              <span class="el-icon-video-camera" v-if="scope.row.mv"></span>
            </template>
          </el-table-column>
          <el-table-column prop="al.name"  label="专辑"></el-table-column>
          <el-table-column label="时间">
            <template slot-scope="scope">
              {{scope.row.dt | toMinSecFormat}}
            </template>
          </el-table-column>
          <el-table-column label="操作">
          <template>
            <span class="el-icon-download"></span>
            <span class="el-icon-star-off"></span>
          </template>
          </el-table-column>
        </el-table>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  inject: ['reload'],
  data () {
    return {
      keywords: '',
      musicListData: [],
      videoUrl: '', // 用于存放视频地址
      playListInfo: {}, // 用于存放歌单信息详情
      songInfoArr: [] // 存放歌曲详情
    }
  },
  mounted () {
    if (this.$route.query.keywords) {
      this.keywords = this.$route.query.keywords
      this.getSearchSong(this.keywords)
    }
    if (this.$route.query.id) {
      this.getPlayListInfoById(this.$route.query.id)
    }
  },
  methods: {
    // 根据关键字查询歌曲
    async getSearchSong (keywords) {
      let time = new Date().getTime()
      const result = await this.$http.get('/search', { params: { keywords, time } })
      if (result.status !== 200) {
        return this.$message.error('搜索失败请重试')
      } else {
        this.musicListData = result.data.result.songs
      }
    },
    // 根据id查询播放列表信息
    async getPlayListInfoById (id) {
      const result = await this.$http.get('/playlist/detail', { params: { id } })
      if (result.status !== 200) {
        this.$message.error('获取歌单信息失败')
      }
      this.playListInfo = result.data.playlist
    },
    // 播放音乐
    async playMusic (row) {
      const { data: res } = await this.$http.get('/song/url', { params: { id: row.id } })
      if (res.code !== 200) {
        return this.$message.error('播放歌曲失败请重试')
      }
      // 使用vuex存储音频数据,把音频信息传递到音乐播放控制组件
      this.$store.dispatch('saveAudioUrl', res.data[0])
      // 判断是关键字搜索的行数据还是歌单数据 需统一格式数据显示在音乐控制面版
      if (row.artists) {
        let ids = row.id
        const { data: res } = await this.$http.get('/song/detail', { params: { ids } })
        this.$store.dispatch('saveAudioInfo', res.songs[0])
        return false
      }
      this.$store.dispatch('saveAudioInfo', row)
    },
    // 列表展开时触发
    async expandChange (row) {
      // row展开行的数据
      // 判断是否有mvid如果有则发送请求获取视频播放地址
      if (row.mvid || row.mv) {
        const mvid = row.mvid || row.mv
        if (mvid === 0) {
          return false
        }
        const { data: res } = await this.$http.get('/mv/detail', { params: { mvid } })
        if (res.code !== 200) {
          return this.$message.error('获取视频失败')
        }
        const obj = res.data.brs
        let arr = []
        for (const key in obj) {
          arr.push(obj[key])
        }
        if (arr.length >= 2) {
          this.videoUrl = arr[1]
        } else {
          this.videoUrl = arr[0]
        }
      }
    }
  },
  watch: {
    $route (newVal) {
      this.keywords = newVal.query.keywords
    },
    keywords (newVal) {
      this.getSearchSong(newVal)
    }
  }
}
</script>
<style lang="less" scoped>
.keyword {
  top: 0 !important;
}
.musicListContainer {
  width: 100%;
  height: 100%;
  background: white;
  position: relative;
  // 歌单的详细信息
  .musicListInfo {
    width: 100%;
    height: 200px;
    position: relative;
    overflow: hidden;
    .el-icon-back {
      font-size: 32px;
    }
    .playList {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: 800px;
      height: 200px;
      .playListInfoImg {
        float: left;
        width: 200px;
        height: 100%;
        border: 1 solid #000;
        border-radius: 5px;
        img {
          border-radius: 5px;
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .PlayInfoContent {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        .titleBox {
          display: flex;
          align-items: center;
          margin-left: 20px;
          span {
            margin-left: 40px;
          }
        }
        .creatUserInfo {
          display: flex;
          align-items: center;
          margin-left: 20px;
          img {
            border-radius: 50%;
          }
          span {
            margin-left: 20px;
          }
        }
        .desc {
          margin-left: 20px;
          font-size: 14px;
          height: 80px;
          overflow: auto;
        }
      }
    }
  }
  // 歌单歌曲/关键字搜索歌曲列表
  .tableList {
    width: 100%;
    position: absolute;
    top: 200px;
    right: 0;
    bottom: 0;
    left: 0;
    .el-card {
      height: 100%;
      .el-table {
        height: 100%;
        .cell {
          font-size: 12px;
        }
        .el-icon-download,.el-icon-star-off,.el-icon-video-camera{
          font-size: 16px;
          margin-left: 12px;
        }
        .el-icon-video-camera {
          color: red;
          font-weight: bold;
        }
        .el-table__expanded-cell[class*=cell] {
          padding: 0;
        }
        .mvContainer {
          width: 100%;
          height: 300px;
          display: flex;
          flex-direction: column;
          align-items: center;
          video {
            width: 800px;
            height: 300px;
            border-radius: 8px;
          }
        }
        .el-icon-video-camera {
          cursor: pointer;
        }
      }
    }
  }
}
.el-table__expanded-cell {
    padding: 0;
  }
</style>
