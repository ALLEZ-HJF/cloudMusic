<template>
  <div class="musicListContainer">
    <div class="musicListInfo" v-if="!keywords"></div>
    <div class="tableList">
      <el-card :body-style="{height: '100%'}">
        <el-table :data="musicListData" border style="width: 100%" max-height="600px">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="artists[0].name" label="歌手" width="180"></el-table-column>
          <el-table-column prop="name" label="歌曲名" width="180"></el-table-column>
          <el-table-column prop="mvid" label="mv播放"></el-table-column>
          <el-table-column prop="album.name" label="专辑"></el-table-column>
          <el-table-column prop="duration" label="时间"></el-table-column>
          <el-table-column label="操作">
            <template>
              <span class="el-icon-download"></span>
              <span class="el-icon-star-off"></span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
      keywords: '',
      musicListData: []
    }
  },
  mounted () {
    if (this.$route.query.keywords) {
      this.keywords = this.$route.query.keywords
      this.getSearchSong(this.keywords)
    }
  },
  methods: {
    async getSearchSong (keywords) {
      const result = await this.$http.post('/search', { keywords })
      if (result.status !== 200) {
        console.log('err')
      } else {
        this.musicListData = result.data.result.songs
        console.log(this.musicListData)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.musicListContainer {
  width: 100%;
  height: 100%;
  background: white;
  // 歌单的详细信息
  .musicListInfo {
    width: 100%;
    height: 200px;
  }
  // 歌单歌曲/关键字搜索歌曲列表
  .tableList {
    width: 100%;
    height: 100%;
    .el-card {
      height: 100%;
      .el-table {
        height: 100%;
        .el-icon-download,.el-icon-star-off{
          font-size: 16px;
          margin-left: 12px;
        }
      }
    }
  }
}
</style>
