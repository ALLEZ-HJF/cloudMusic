<template>
  <div class="musicContainer">
    <nav class="menu">
      <el-popover
        placement="bottom"
        width="500"
        trigger="click">
        <el-button class="catItem" type="mini" v-for="(cat, index) in catList" :key="index" @click="getPlayListByCatName(cat.name)">{{cat.name}}</el-button>
        <el-button slot="reference" size="mini" round>
          全部歌单
        </el-button>
      </el-popover>
      <div class="hotmenu">
        <ul class="list">
          <li v-for="(item, index) in hotCatList" :key="index">
            <a href="javascript:;" @click="getPlayListByCatName(item.name)">{{item.name}}</a>
          </li>
        </ul>
      </div>
    </nav>
    <div class="songSheetBox">
      <div class="item" v-for="(item, index) in playList" :key="index">
         <a href="javascript:;" @click="gotoMusicList(item)">
          <el-image :src="item.coverImgUrl+'?param=230y200'" lazy>
          </el-image>
          <div class="mask">
            <svg t="1577420878542" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1133" width="200" height="200"><path d="M512 0A512 512 0 1 0 1024 512 512.589353 512.589353 0 0 0 512 0z m223.953957 535.574101l-294.676259 221.007194a29.467626 29.467626 0 0 1-17.680576 5.893525 29.467626 29.467626 0 0 1-29.467626-29.467626v-442.014388a29.467626 29.467626 0 0 1 47.148202-23.574101l294.676259 221.007194a29.467626 29.467626 0 0 1 0 47.148202z" fill="#333333" p-id="1134"></path></svg>
          </div>
         </a>
          <div class="userInfo">
            <span class="el-icon-user-solid"></span>
            {{item.creator.nickname}}
          </div>
          <p>{{item.name}}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      catList: [], // 存放全部歌单
      hotCatList: [], // 存放热门歌单列表
      playList: [] // 存放歌单信息
    }
  },
  created () {
    this.getCatList()
    this.getHotCatList()
  },
  methods: {
    async getCatList () {
      const { data: res } = await this.$http.get('/playlist/catlist')
      if (res.code !== 200) {
        return this.$message.error('获取全部歌单失败请刷新页面重试')
      }
      this.catList = res.sub
    },
    async getHotCatList () {
      const { data: res } = await this.$http.get('/playlist/hot')
      if (res.code !== 200) {
        return this.$message.error('获取全部歌单失败请刷新页面重试')
      }
      this.hotCatList = res.tags
      // 初始化歌单信息默认为热门歌单分类第一个
      this.getPlayListByCatName(this.hotCatList[0].name)
    },
    async getPlayListByCatName (name) {
      const { data: res } = await this.$http.get('/top/playlist', { params: { cat: name } })
      if (res.code !== 200) {
        return this.$message.error(`获取${name}歌单失败,请重试`)
      }
      this.playList = res.playlists
    },
    async gotoMusicList (item) {
      this.$router.push({ path: '/main/musiclist', query: { id: item.id } })
    }
  }
}

</script>
<style lang="less" scoped>
.musicContainer {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .songSheetBox {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    flex: 1;
    overflow: auto;
    .item {
      margin: 20px 15px;
      width: 230px;
      height: 270px;
      border-radius: 5px;
      background: rgba(255, 255, 255, .9);
      box-shadow: 0 0px 5px gray;
      font-size: 14px;
      position: relative;
      &:hover .mask{
        background: black;
        bottom: 70px;
        opacity: .3;
        svg {
          position: absolute;
          display: block;
          width: 50px;
          height: 50px;
          left: 50%;
          top: 50%;
          margin-left: -25px;
          margin-top: -25px;
          transform: scale(1.5);
          transition: 1s;
        }
      }
      .mask {
        position: absolute;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 270px;
        transition: bottom 1s;
        svg {
          width: 0;
          height: 0;
        }
      }
      .el-image {
        border-radius: 5px 5px 0 0;
      }
      .userInfo {
        margin: 5px 0 5px 10px;
        color: rgb(211, 5, 5);
        font-size: 14px;
        .el-icon-user-solid {
          font-size: 16px;
          font-weight: bold;
        }
      }
      p {
        margin-left: 10px;
        font-size: 13px;
      }
    }
  }
  .menu {
    height: 50px;
    width: 100%;
    background: rgba(0, 0, 0, .5);
    border-radius: 0 0 5px 5px;
    box-shadow: 2px 0 5px rgba(0, 0, 0, .5);
    overflow: hidden;
    .el-button {
      float: left;
      margin: 10px 0 5px 50px;
    }
    .hotmenu {
      float: right;
      height: 100%;
      text-align: center;
      overflow: hidden;
      .list {
        display: inline-block;
        height: 100%;
        li {
          float: left;
          width: 80px;
          line-height: 50px;
          a {
            color: #ddd;
            &:hover {
              color: white;
              transition: .8s color;
            }
          }
        }
      }
    }
  }
}
</style>
