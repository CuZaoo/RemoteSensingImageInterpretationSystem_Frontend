<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>

<script>
import echarts from 'echarts'

require('echarts/theme/macarons') // echarts theme

export default {
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    chartData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      // 初始化数据
      this.chart = echarts.init(this.$el, 'macarons')
      // 设置数据，这里传入一个Object包含属性：days和times
      this.setOptions(this.chartData)
      const c = this.chart
      window.addEventListener('resize', () => {
        c.resize()
      })
    },
    setOptions(actualData) {
      this.chart.setOption({
        xAxis: {
          data: actualData.days,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['变化检测', '目标检测', '目标提取', '地物分类']
        },
        series: [
          {
            name: '变化检测',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#9475cc',
                lineStyle: {
                  color: '#9475cc',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData.times[0],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '目标检测',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#33a3ea',
                lineStyle: {
                  color: '#33a3ea',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData.times[1],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '目标提取',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#b69243',
                lineStyle: {
                  color: '#b69243',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData.times[2],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          },
          {
            name: '地物分类',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#3888fa',
                lineStyle: {
                  color: '#3888fa',
                  width: 2
                },
                areaStyle: {
                  color: '#f3f8ff'
                }
              }
            },
            data: actualData.times[3],
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }
        ]
      })
    }
  }
}
</script>
