<template>
  <div>
    <el-dialog
      :visible.sync="intro.isShow"
      width="60%"
      :show-close="true"
    >
      <el-card style="padding:0px;">
        <div
          slot="header"
          class="clearfix"
        >
          <h2>网站介绍</h2>
        </div>
        <div class="intro">
          <div>
            掌握国土资源利用和土地覆盖类型，是地理国情普查与监测的重要内容。高效获取准确、客观的土地利用情况，监测国土变化情况，可以为国家和地方提供地理国情信息决策支撑。随着遥感、传感器技术的发展，特别是多时相高分辨率遥感图像数据的普及，使我们可以足不出户，就能掌握全球任一地表的细微变化。
          </div>
          <div>
            <span style="font-weight:bold;">遥感图像解译系统</span>主要有：<span style="color: red">目标提取</span>、<span style="color: red">变化检测</span>、<span style="color: red">目标检测</span>和<span style="color: red">地物分类</span>四大分析功能
          </div>
          <div>
            <span style="color: red">目标提取</span>（使用图像分割技术对卫星图像中指定对象完成分割）
          </div>
          <div>
            <span style="color: red">变化检测</span>（使用图像分割技术对同区域两个时期的卫星图像变化情况完成分析）
          </div>
          <div>
            <span style="color: red">目标检测</span>（使用目标检测技术对卫星图像中指定对象完成检测）
          </div>
          <div>
            <span style="color: red">地物检测</span>（使用图像分割技术对卫星图像每个像素完成分类）
          </div>
          <div>
            <span style="font-weight:bold;">对网站建议：</span>欢迎使用留言功能，向我们留言，共同使遥感图像解译系统变得更好吧！
          </div>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    intro: Object
  },
  data() {
    return {
      introduceContent: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.intro {
  overflow-y: scroll;
  overflow-x: hidden !important;
  padding: 14px;
  height: 550px;
  font-size: 20px;
  line-height: 50px;
}
// 重写elementui部分css
>>> .el-dialog__header{
  padding: 0px;
}

>>> .el-dialog__body{
  padding: 0px;
}
</style>>

