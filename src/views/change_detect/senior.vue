<template>
  <el-container :style="{height:windowHeight - 100+'px'}">
    <el-main>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="20">
          <el-card :style="{height:windowHeight - 160+'px'}">
            <div slot="header" class="clearfix">
              <span style="font-size: 20px;text-align: center">高 级 检 测</span>
              <span style="float: right; padding-right: 3px">
                                    <el-button type="primary" @click="is_Upload">上传图片</el-button>
                </span>
              <el-dialog title="上传图片" :show-close="false" :visible.sync="isUpload" width="40%">
                <div>
                  <el-upload
                    drag
                    :on-success="uploadSuccess_all"
                    :action="imagesUploadApi"
                    multiple
                    ref="upload"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :file-list="fileList"
                    :auto-upload="false"
                    :headers="headers"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">支持多选上传</div>
                  </el-upload>
                </div>
                <div slot="footer" class="dialog-footer">
                  <el-button size="small" type="success" @click="submitUpload">上传到服务器</el-button>
                  <el-button @click="isUpload = false">取 消</el-button>
                </div>
              </el-dialog>
            </div>
            <Table/>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="4">
          <el-card>
            <div slot="header" class="clearfix">
              <span>功 能</span>
            </div>
            <div>
              <el-row>
                <el-col :xs="24" :sm="24" :lg="24">
                  <el-tooltip class="item" effect="dark" content="选择处理多个图片的模型" placement="left">
                    <el-select v-model="selectedModelID" placeholder="待运行模型" popper-class="selectJob"
                               @change="selectChange" @visible-change="getTableList"
                    >
                      <el-option v-for="model in selectableModels" :key="model.modelId" :label="model.name"
                                 :value="model.modelId"
                      />
                      <div style="text-align:center">
                        <span class="text" @click.stop="prePage">上一页</span>
                        <span class="text" @click.stop="nextPage">下一页</span>
                      </div>
                    </el-select>
                  </el-tooltip>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-descriptions title="模型信息" :column="1">
                    <el-descriptions-item label="训练次数">{{ nowModel.time }}</el-descriptions-item>
                    <el-descriptions-item label="年份">
                      <el-tag size="small">{{ nowModel.year }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="对应论文">
                      <el-link type="primary" :href="nowModel.url" target="_blank" :underline="false">{{
                          nowModel.url
                        }}
                      </el-link>
                    </el-descriptions-item>
                    <el-descriptions-item label="MIOU">{{ nowModel.miou }}</el-descriptions-item>
                    <el-descriptions-item label="F1分数">{{ nowModel.f1 }}</el-descriptions-item>
                  </el-descriptions>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xs="24" :sm="24" :lg="24">
                  <el-button type="success" icon="el-icon-s-promotion" plain style="width:100%" @click="handleRunModel">
                    全部运行
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col>
                  <el-button type="info" icon="el-icon-sort-down" style="width:100%" @click="loadFileList">
                    导出已处理图片
                  </el-button>
                </el-col>
              </el-row>
              <el-row>
                <el-col :xs="24" :sm="24" :lg="24">
                  <el-button @click="del_img_all" type="danger" icon="el-icon-refresh-right"
                             style="width:100%"
                  >重置全部
                  </el-button>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
<!--    <div class="toLeft is_fixed" :style="activeStyleLeft" @mouseover="mouseOver(true)"-->
<!--         @mouseleave="mouseLeave"-->
<!--    >-->
<!--      <el-tooltip effect="dark" content="切换模式" placement="left">-->
<!--        <el-button :circle="true" style="background-color: #c0c4cc;" @click="handleSheetChange">-->
<!--          <el-avatar :size="50" style="border: #fde1ff 1px solid;" icon="el-icon-d-arrow-left"></el-avatar>-->
<!--        </el-button>-->
<!--      </el-tooltip>-->
<!--    </div>-->

    <el-dialog
      title="结果(点击图片查看大图)"
      :visible.sync="showResult"
      center
    >
      <div v-if="!is_detect  && (bhjc_img_list_results === null || bhjc_img_list_results[0] === undefined)">
        <span slot="reference">
           <el-empty :image-size="200" description="暂无结果"></el-empty>
        </span>
      </div>
      <div v-else-if="bhjc_img_list_results === null || bhjc_img_list_results[0] === undefined">
        <img :src="loadingImg" alt="" :style="{height:windowHeight - 340+'px',width:windowHeight - 140+'px'}">
        <span style="position: absolute;left: 33%;top: 45%;font-size: 70px" class="_loading">L o a d i n g</span>
      </div>
      <div v-else>
        <el-image
          :preview-src-list="[bhjc_img_list_results[0]]"
          :style="{height:windowHeight - 300+'px',width:windowHeight - 60+'px'}"
          :src="bhjc_img_list_results[0]"
          fit="fill"
        ></el-image>
        <span style="position: absolute;bottom: 10%;left: 44%">
          <el-button style="width: 120px" type="success" @click="downloadByUrl(bhjc_img_list_results[0],'download')"
                     round
          >下载</el-button>
        </span>
      </div>
    </el-dialog>
  </el-container>

</template>

<script>
import Table from '@/views/change_detect/components/Table'
import JSZip from 'jszip'
import {
  getModelByPage, run, runAll
} from '@/api/task/bhjc'
import { saveAs } from 'file-saver'
import {
  getStatCount, recordPV
} from '@/api/common/index'
import {
  mapGetters
} from 'vuex'
import { getToken } from '@/utils/auth'

export default {
  name: 'ChangeDetect',
  components: {
    Table
  },
  data() {
    return {
      loadingImg: '',
      is_detect: false,
      percentage: 0,
      progressStatus: false,
      percentage2: 0,
      progressStatus2: false,
      fileList: [],
      isUpload: false,
      isUpload2: false,
      bhjc_nums: 0,
      showHelp: false,
      is_result: false,
      showResult: false,
      soloTask_artwork: true,
      is_img1: false,
      is_img2: false,
      is_solo: true,
      showRight: false,
      leftCol: 24,
      rightCol: 0,
      sheet: 2,
      soloTask: true,
      mainStyle: {
        height: this.windowHeight - 500
      },
      windowWidth: document.documentElement.clientWidth, // 获取屏幕宽度
      windowHeight: document.documentElement.clientHeight, // 获取屏幕高度
      activeStyleLeft: {},
      activeStyleTop: {},
      selectableModels: ['UNet', 'BIT'],
      selectedModelID: '',
      total: null, // 获取总数据量
      page: 1, // 获取总页数
      size: 6, // 当前页数
      pageCount: 2,
      nowModel: {
        name: '模型名',
        time: '**',
        year: '/',
        url: '/',
        miou: '**',
        f1: '**',
        modelId: -1
      },
      bhjc_img_list_results: null,
      bhjc_all_run: false,
      headers: {
        'Authorization': getToken()
      }
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'bhjc_img_list',
      'user',
      'bhjc_img_list_result',
      'loading_img_path'
    ])
  },
  watch: {
    bhjc_img_list_result(newVal, oldVal) {
      this.bhjc_img_list_results = newVal
    }
  },
  mounted() {
    var that = this
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        window.fullWidth = document.documentElement.clientWidth
        that.windowHeight = window.fullHeight // 获取屏幕高度
        that.windowWidth = window.fullWidth // 获取屏幕宽度
      })()
    }
    this.bhjc_img_list_results = this.bhjc_img_list_result
    //  获取最新的运行统计
    // getStatCount(3).then(res => {
    //   this.bhjc_nums = res.count
    // })

    //刷新提示
    window.onbeforeunload = e => {
      if (!this.modified) {
        return
      }
      // 通知浏览器不要执行与事件关联的默认动作
      e.preventDefault()
      // Chrome 需要 returnValue 被设置成空字符串
      e.returnValue = ''
    }

    // var index = Math.floor((Math.random()*this.loading_img_path.length))
    // this.loadingImg =  require('@/assets/loading/'+this.loading_img_path[index])
  },
  methods: {
    beforeUpload(file) {
      this.progressStatus = true
    },
    uploadProgress(event, file, fileList) {
      let _self = this
      if (event.lengthComputable) {
        let val = (event.loaded / event.total * 100).toFixed(0)
        var progress = parseInt(val)
        _self.percentage = progress
        if (progress === 100) {
          this.progressStatus = false
        }
      }
    },
    beforeUpload2(file) {
      this.progressStatus2 = true
    },
    uploadProgress2(event, file, fileList) {
      let _self = this
      if (event.lengthComputable) {
        let val = (event.loaded / event.total * 100).toFixed(0)
        var progress = parseInt(val)
        _self.percentage2 = progress
        if (progress === 100) {
          this.progressStatus2 = false
        }
      }
    },
    handlePreview(file) {
    },
    handleRemove(file, fileList) {
    },
    submitUpload() {
      this.$refs.upload.submit()

    },
    is_Upload() {
      this.fileList = []
      this.isUpload = !this.isUpload
    },
    downloadByUrl(url, name) {
      let image = new Image()
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
      image.onload = () => {
        let canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        let ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0, image.width, image.height)
        canvas.toBlob((blob) => {
          let url = URL.createObjectURL(blob)
          this.download(url, name)
          // 用完释放URL对象
          URL.revokeObjectURL(url)
        })
      }
    },
    download(href, name) {
      let eleLink = document.createElement('a')
      eleLink.download = name
      eleLink.href = href
      eleLink.click()
      eleLink.remove()
    },
    detect(img_list) {
      if (img_list === undefined) {
        this.showHelp = true
        this.$message.warning('未检测到图片，请上传图片')
        return
      }
      this.$confirm('是否开始检测?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showHelp = false
        let types = this.soloTask ? 0 : 1
        let modelIds = this.soloTask ? 0 : this.nowModel.modelId
        let userId = this.user.id
        console.log('用户ID')
        console.log(userId)
        // 随机获取一个load动画
        var index = Math.floor((Math.random() * this.loading_img_path.length))
        this.loadingImg = require('@/assets/loading/' + this.loading_img_path[index])
        this.is_detect = true
        this.showResult = true
        run(img_list.img1, img_list.img2, types, modelIds, userId).then(res => {
          this.$store.dispatch('set_img_to_bhjc_result', res.img_result_url)
          this.$message.success('检测完毕')

        }).catch(err => {
          this.$message.error('提取异常')
          this.is_detect = false
        })
        //记录运行次数
        recordPV(3).then(res => {
          this.bhjc_nums = res.count
        })
      })
    },
    handleShowResult() {
      this.showResult = true
      this.showHelp = false
    },
    uploadSuccess_solo(response, file, fileList) {
      this.showHelp = false
      this.is_img1 = true
      this.$store.dispatch('set_img_to_bhjc', response.path)
    },
    uploadSuccess_solo2(response, file, fileList) {
      this.showHelp = false
      this.is_img2 = true
      this.$store.dispatch('set_img_to_bhjc2', {
        'index': 0,
        'img': response.path
      })
    },
    mouseOver(flag) {
      if (flag) {
        this.activeStyleLeft = 'right:10px'
      }
    },
    del_img_solo_all() {
      this.$confirm('是否删除当前图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.is_detect = false
        this.del_img()
      })
    },
    del_img_all() {
      this.$confirm('是否重置当前任务(所有图片将被删除)?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.del_img()
      })
    },
    del_img() {
      this.$store.dispatch('del_img_to_bhjc_all')
      this.is_img1 = false
      this.is_img2 = false
      this.bhjc_img_list_results = null
    },
    mouseLeave() {
      this.activeStyleLeft = ''
    },
    handleRunModel() {
      if (this.selectedModel === '') {
        this.$message.error('未选择模型')
        return
      }
      // 运行模型逻辑
      let types = this.soloTask ? 0 : 1
      if (this.nowModel.modelId === -1) {
        this.$message.warning('请选择运行模型！')
        return
      }
      if (this.user.id === null || this.user.id === undefined) {
        this.$message.warning('该功能需要登录使用！')
        return
      }
      if (this.bhjc_img_list.length === 0) {
        this.$message.warning('没有可处理图片！')
        return
      }
      // 弹框确认
      this.$confirm('是否处理全部图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '已确认运行'
        })

        let modelIds = this.nowModel.modelId

        let userId = this.user.id
        // let userId = 0
        runAll(this.bhjc_img_list, 1, modelIds, userId).then(res => {
          this.bhjc_all_run = true
          this.$store.dispatch('set_img_to_bhjc_result_all', res.img_result_urls)
          this.$message.success('提取完毕')
        }).catch(err => {
          this.$message.error('提取异常')
        })

      }).catch(() => {

      })
    },
    loadFileList() {
      let arr = this.bhjc_img_list_result.map((item, i) => {
        return { 'url': item, 'name': i + '' }
      })
      if (arr.length === 0) {
        this.$message.warning('没有可导出的处理图！')
        return
      }
      this.batchDownload(arr)
    },
    handleSheetChange() {
      if (this.user.id === undefined) {
        this.$message.warning('请“登录”使用多图处理功能')
        return
      }
      this.soloTask_artwork = !this.soloTask_artwork
      this.soloTask = !this.soloTask
      if (this.soloTask_artwork) {
        this.showRight = false
        this.leftCol = 24
        this.rightCol = 0
        this.is_solo = true
      } else {
        this.showRight = true
        this.leftCol = 20
        this.rightCol = 4
        this.is_solo = false
      }
    },
    prePage() {
      --this.page
      if (this.page < 1) {
        // 判断点击的页数是否小于1
        this.page = 1
      }
      this.getTableList(true)
    },
    nextPage() {
      if (this.page < this.pageCount) {
        // 判断点击的页数是否小于总页数;
        ++this.page
        this.getTableList(true)
      }
    },
    getTableList(val) {
      if (val) {
        getModelByPage(2, this.page, this.size).then((res) => {
          this.selectableModels = res.content
          this.pageCount = res.totalPages
        }).catch((error) => {
        })
      }
    },
    selectChange(value) {
      this.nowModel = this.selectableModels.find(val => val.modelId === value)
    },
    uploadSuccess_all(response, file, fileList) {
      this.isUpload = false

      if (this.bhjc_all_run) {
        this.$store.dispatch('del_img_to_bhjc_all')
      }
      this.$store.dispatch('set_img_to_bhjc', response.path)
      // this.fileList.push(file)
    },
    getImgArrayBuffer(url) {
      return new Promise((resolve, reject) => {
        //通过请求获取文件blob格式
        let xmlHTTP = new XMLHttpRequest()
        xmlHTTP.open('GET', url, true)
        xmlHTTP.responseType = 'blob'
        xmlHTTP.onload = function() {
          if (this.status == 200) {
            resolve(this.response)
          } else {
            reject(this.status)
          }
        }
        xmlHTTP.send()
      })
    },
    // 批量下载
    batchDownload(urls) {
      let zip = new JSZip()
      var imgObj = {}
      let promises = []
      for (let obj of urls) {
        const promise = this.getImgArrayBuffer(obj.url).then(data => {
          zip.file(obj.name + '.png', data, { binary: true }) // 逐个添加文件
          imgObj[obj.name] = data
        })
        promises.push(promise)
      }

      Promise.all(promises).then(async() => {
        try {
          const content = await zip.generateAsync({ type: 'blob' })
          await saveAs(content, '处理图')
        } catch (error) {
          this.$message.error('处理图压缩异常')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.is_fixed {
  position: fixed;
  top: 40%;
  transition: left 1s, right 1s;
}

.toLeft {
  right: -10px;
}

.is_fixed_artwork {
  position: fixed;
  right: 48%;
  transition: bottom 1s, top 1s;
}

.toBottom {
  bottom: 50px;
}

body,
html {
  margin: 0px;
  padding: 0px;
  height: 100%;
  width: 100%;
}


.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 160px; */
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 0px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}

.el-row .el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  transition: all 0.5s;
}

.card_style {
  position: relative;
  left: 1%;
  right: 1%;
  top: 1%;
  bottom: 1%;
}

// .radio_button{
//   width: 60px;
// }

.centerVertically {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

._loading {
  animation-name: loading_anim;
  animation-duration: 1.5s;
  animation-iteration-count: infinite;
  -webkit-animation-iteration-count: infinite;
  animation-direction: alternate;
  -webkit-animation-direction: alternate;
  animation-timing-function: ease-out;
  -webkit-animation-timing-function: ease-out;
}

@keyframes loading_anim {
  0% {
    opacity: 100;
  }
  100% {
    opacity: 0;
  }
}

@-webkit-keyframes loading_anim {
  0% {
    opacity: 100;
  }
  100% {
    opacity: 0;
  }
}

</style>
