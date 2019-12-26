<template>
  <div class="controllerContainer">
    <el-row :gutter="10">
      <el-col :span="7">
        <div class="controller">
          <div class="songImg"></div>
          <div class="icon">
            <div class="item">
              <span class="iconfont icon-shangyishou"></span>
              <span class="iconfont icon-kaishi"></span>
              <span class="iconfont icon-xiayishou"></span>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="9">
        <div class="time">
          <span class="nowTime">当前播放时间:</span>
          <div class="timeSlide">
            <span class="bg"></span>
            <span class="fg"></span>
            <span class="item"></span>
          </div>
          <span class="totalTime">总时间</span>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="sound">
          <span class="iconfont icon-shengyin"></span>
          <div class="soundSlide">
              <span class="bg"></span>
              <span class="fg"></span>
              <span class="item"></span>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data () {
    return {
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
        position: relative;
        .songImg {
          float: left;
          width: 80px;
          height: 45px;
          background-image: url('../../assets/images/1.jpg');
          background-size: 100% 100%;
          border-radius: 5px;
          margin: 5px 0 5px 50px;
          box-shadow: 0 0 3px black;
        }
        .icon {
          overflow: hidden;
          height: 100%;
          position: relative;
          .item {
            display: inline;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
          }
          .iconfont {
            font-size: 20px;
            margin-left: 30px;
            border: 7px solid;
            border-radius: 50%;
            border-color: red;
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
          .itemSlide(300px,150px)
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
          .itemSlide(150px,75px,75px)
        }
      }
    }
  }
}
</style>
