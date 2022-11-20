<template>
  <div>
    <!--    <el-dialog-->
    <!--      title="留言"-->
    <!--      :visible.sync="message.isShow"-->
    <!--      :modal="true"-->
    <!--      :close-on-click-modal="true"-->
    <!--    >-->
    <el-table
      v-loading="dataLoading"
      v-el-table-infinite-scroll="load"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      infinite-scroll-throttle-delay="1000"
      :infinite-scroll-immediate="true"
      :data="tableData.filter(data => !searchValue || data.messageContent.toLowerCase().includes(searchValue.toLowerCase()) || data.createTime.toLowerCase().includes(searchValue.toLowerCase()))"
      height="380"
      style="overflow:auto"
      :stripe="true"
    >

      <el-table-column
        prop="createTime"
        label="日期"
      />
      <el-table-column
        prop="messageContent"
        label="内容"
      />
      <el-table-column
        align="right"
      >
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="searchValue"
            size="mini"
            placeholder="输入关键字搜索"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--    </el-dialog>-->
  </div>

</template>

<script>
import elTableInfiniteScroll from 'el-table-infinite-scroll'
import { getNewMessage } from '@/api/message/index'
import qs from 'qs'

export default {
  name: 'Message',
  directives: {
    'el-table-infinite-scroll': elTableInfiniteScroll
  },
  props: { message: { default: null, type: Object } },
  data() {
    return {
      searchValue: '',
      dataLoading: false,
      windowWidth: document.documentElement.clientWidth, // 获取屏幕宽度
      windowHeight: document.documentElement.clientHeight, // 获取屏幕高度
      page: 1, // 起始页数值为0
      size: 15, // 取后端返回内容的总页数
      tableData: [] // 后端返回的数组
    }
  },
  // watch: {
  //   message: {
  //     // 监控props传过来的控制dialog的值,每次打开都会刷新初始化最新数据
  //     handler: function(val, oldVal) {
  //       if (val.isShow) {
  //         this.tableData = []
  //         this.initMessage()
  //       }
  //     },
  //     deep: true
  //   }
  // },
  mounted() {
    this.initMessage()
  },
  methods: {
    load() {
      const nowTime = new Date().getTime()
      const diffTime = (nowTime - this.lastTime) / 1000

      if (diffTime > 0.5) {
        this.page = this.page + 1
        this.getMessage()
      }
      this.lastTime = nowTime
      // 无限滚动插件的导入函数，保证每次到达底部都会刷新数据
    },
    getMessage() {
      // 获取留言的接口函数，目前使用list2来模拟数据
      getNewMessage(this.page, this.size).then(res => {
        this.tableData = this.tableData.concat(res.content)
        console.log(this.tableData.length)
      })
    },
    initMessage() {
      console.log('初始化消息')
      this.dataLoading = true
      // 每次点击更多留言都会去获取最新的数据
      getNewMessage(this.page, this.size).then(res => {
        console.log(res)
        this.dataLoading = false
        this.tableData = res.content
      })
    },

    searchInput(value) {
      console.log(value)
    }
  }
}
</script>

<style>
</style>
