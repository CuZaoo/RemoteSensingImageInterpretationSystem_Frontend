<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <github-corner class="github-corner"/>
      <el-card class="box-card" style="padding:16px 16px 0;margin-bottom:16px;">
        <div slot="header" class="clearfix">
          <span style="font-size: large;"><b>欢迎回来！{{this.user.nickName}} </b></span>
        </div>
        <div class="text item">
          <panel-group v-if="isShow" :visitors="visitors" @handleSetLineChartData="handleSetLineChartData"/>
        </div>
      </el-card>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="16">
          <el-card class="box-card" style="padding:16px 16px 0;margin-bottom:16px;">
            <div slot="header" class="clearfix">
              <span>调用数据</span>
            </div>
            <div class="text item">
              <CallTimeChart :chart-data="lineChartData"/>
              <!--              <BarChart/>-->
            </div>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <el-card class="box-card" style="padding:16px 16px 0;margin-bottom:16px;">
            <div slot="header" class="clearfix">
              <span>调用类型</span>
              <el-button style="float: right; padding: 3px 0" type="text">图像设置</el-button>
            </div>
            <div class="chart-wrapper">
              <pie-chart :chart-data="pieChart"/>
              <!--              <BarChart></BarChart>-->
              <!--              <RadarChart></RadarChart>-->
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import GithubCorner from '@/components/GithubCorner'
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
import CallTimeChart from './dashboard/CallTimeChart'
import PieChart from '@/components/Echarts/PieChart'
import BarChart from '@/components/Echarts/BarChart'
import { mapGetters } from 'vuex'
import RadarChart from '@/components/Echarts/RadarChart'
import {
  getStatCount, recordPV, getAllStatCount, getAllStatCountOf7Day
} from '@/api/common/index'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
const pieChart = [0, 0, 0, 0]
export default {
  name: 'Dashboard',
  components: {
    GithubCorner,
    PanelGroup,
    LineChart,
    PieChart,
    BarChart,
    CallTimeChart,
    RadarChart
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      stat_nums: [],
      pieChart: { datas: [10, 100, 0, 0] },
      visitors: 0,
      isShow: true
    }
  },
  methods: {
    reload() {
      this.isShow = false
      this.$nextTick(function() {
        this.isShow = true
      })
    },
    handleSetLineChartData(type) {
      // this.lineChartData = lineChartData[type]
    }
  },
  mounted() {
    //  获取最新的运行统计
    getAllStatCount().then(res => {
      this.pieChart = res
      this.visitors = res[0]
      console.log(this.pieChart)
    })
    getAllStatCountOf7Day().then(res => {
      this.lineChartData = res
    })
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.notice {
  padding: 5px 0px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}

</style>
