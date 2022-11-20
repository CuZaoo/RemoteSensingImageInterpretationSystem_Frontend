<template>
  <div>
    <el-row :gutter="40" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleSetLineChartData('newVisitis')">
          <div class="card-panel-icon-wrapper icon-people">
            <svg-icon icon-class="peoples" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              网站访客数
            </div>
            <count-to :start-val="0" :end-val="visitors" :duration="2600" class="card-panel-num"/>
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <el-col class="card-panel-col">
          <div
            class="card-panel"
            @click="handleShowData('newMessage',2)"
          >
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon
                icon-class="message"
                class-name="card-panel-icon"
              />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">
                点击留言
              </div>
              <count-to
                :start-val="0"
                :end-val="messageEndVal"
                :duration="3000"
                class="card-panel-num"
              />
            </div>
          </div>
        </el-col>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleShowLines()">
          <div class="card-panel-icon-wrapper icon-money">
            <svg-icon icon-class="money" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text" style="padding: 20px">
              查看额度
            </div>
            <!--            <count-to :start-val="0" :end-val="9280" :duration="3200" class="card-panel-num"/>-->
          </div>
        </div>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <div class="card-panel" @click="handleShowWebIntroduce()">
          <div class="card-panel-icon-wrapper icon-shopping">
            <svg-icon icon-class="web" class-name="card-panel-icon"/>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text" style="padding: 20px">
              网站介绍
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-dialog
      title="7日留言统计"
      :visible.sync="showMessageChart"
      :modal="true"
      :close-on-click-modal="true"
      width="80%"
    >
      <el-row>
        <el-col :xs="12" :sm="12" :lg="16">
          <line-chart :chart-data="chartMessage"/>

          <div>
            <el-row>
              <el-col :push="4">
                <el-input
                  v-model="messageContent"
                  :rows="2"
                  :autofocus="true"
                  :maxlength="40"
                  style="width:60%"
                  placeholder="为网站留下你想说的一句话吧！"
                />
                <el-button
                  type="primary"
                  @click="putMessage"
                >留言
                </el-button>
              </el-col>
            </el-row>

          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :lg="8">
          <message :message="showMessage"></message>
        </el-col>
      </el-row>

    </el-dialog>

    <el-dialog
      :visible.sync="showLines"
      :modal="true"
      :close-on-click-modal="true"
    >
      <el-card style="padding:0px;">
        <div
          slot="header"
          class="clearfix"
        >
          <h2>查看额度</h2>
        </div>
        <el-row>
          <el-col>
            <span class="size-icon">
              <i class="el-icon-bicycle"></i>
            </span>
            <span style="font-size: 30px">
              基础版使用次数：    {{ this.line.linesBasic }}
            </span>
          </el-col>
          <el-col style="padding: 30px 0">
            <span class="size-icon">
              <i class="el-icon-truck"></i>
            </span>
            <span style="font-size: 30px">
               高级版使用次数：    {{ this.line.linesPlus }}
            </span>
          </el-col>
          <el-col>
            <span class="size-icon">
              <i class="el-icon-timer"></i>
            </span>
            <span style="font-size: 30px">
              更 新  时 间：
            <time class="time">    {{ this.line.updateTime }}</time>
            </span>
          </el-col>
        </el-row>
      </el-card>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="showLines = false">确 定</el-button>
        </span>
    </el-dialog>
    <introduce :intro="isIntroduce"/>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'
import Introduce from '@/views/dashboard/Introduce'
import { mapGetters } from 'vuex'
import message, { getMessageSize } from '@/api/message/index'
import LineChart from '@/views/dashboard/LineChart'
import {
  showLines
} from '@/api/common/index'
import Message from '@/views/dashboard/Message'

export default {
  components: {
    CountTo,
    LineChart,
    Introduce,
    Message
  },
  props: {
    'visitors': Number
  },
  inject: ['reload'],
  data() {
    return {
      isIntroduce: { isShow: false },
      messageEndVal: 1000,
      showMessage: { isShow: false },
      messageContent: '',
      list: [],
      showVisitChart: false,
      showMessageChart: false,
      time: '10:40',
      destoryTime: null,
      destoryTime2: null,
      chartVisit: null,
      chartMessage: null,
      showLines: false,
      line: {
        linesBasic: 0,
        linesPlus: 0,
        updateTime: '***'
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  mounted() {
    this.initMessageSize()
  },
  methods: {
    initMessageSize() {
      message.getMessageSize().then(res => {
        this.messageEndVal = res
      })
    },
    moreMessage() {
      this.showMessage.isShow = true
    },
    handleShowWebIntroduce() {
      this.isIntroduce.isShow = true
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    },
    handleShowData(type, index) {
      this.getMessageOf7Day()
      this.moreMessage()
      // 模拟数据，与后端对接后应该删除
      // this.lineChartData = this.lineChartDatas[type]
    },
    getMessageOf7Day() {
      message.getMessageOf7Day().then(res => {
        this.showMessageChart = true
        this.chartMessage = res
      })
    },
    handleShowLines() {
      this.showLines = true
      showLines(this.user).then(res => {
        this.line.linesBasic = res.linesBasic
        this.line.linesPlus = res.linesPlus
        this.line.updateTime = res.updateTime
      })
    },
    reflesh() {
      this.reload()
    },
    putMessage() {
      const msg = { senderName: '游客', messageContent: this.messageContent }
      if (this.usernickName !== undefined) {
        msg.senderName = this.user.nickName
      }
      if (this.messageContent !== '') {
        message.saveMessage(msg).then(res => {
          this.$message.success('已留言')
          this.showMessageChart = false
          this.messageContent = ''
          // this.$router.push({ path: "/bhjc/bhjc_online" })
          // this.$router.replace({ path:'/empty' })
          this.reflesh()
        }).catch(err => {
          this.$message.error('留言失败')
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shopping {
        background: #5a6e64
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shopping {
      color: #dde8e5
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}

.size-icon {
  font-size: 30px;
}

// 重写elementui部分css
> > > .el-dialog__header {
  padding: 0px;
}

> > > .el-dialog__body {
  padding: 0px;
}
</style>
