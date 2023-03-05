<template>
  <el-container :style="{height:windowHeight - 100+'px'}">
    <el-dialog
      title="查看地图"
      :visible.sync="is_Open"
      :close-on-click-modal="true"
    >
      <el-button type="primary" @click="screenShot">截图</el-button>

      <div id="screen" class="dashboard-container">
        <div class="map-box">
          <div id="map" class="map" :style="{height:windowHeight - 400+'px'}"></div>
        </div>
      </div>
    </el-dialog>
    <el-main>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :lg="20">
          <el-card :style="{height:windowHeight - 160+'px'}">
            <div>
              <div slot="header" class="clearfix">
                <span style="font-size: 20px;text-align: center">地 物 分 类</span>
                <span style="float: right; padding-right: 3px">
                      <el-button type="primary" @click="openMap">从在线地图截图</el-button>
                </span>
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
                      :headers="headers"
                      :auto-upload="false"
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
            </div>
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
                    <el-descriptions-item label="Accuary">{{ nowModel.f1 }}</el-descriptions-item>
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
  </el-container>

</template>

<script>
import Table from '@/views/object_detect/components/Table'
import JSZip from 'jszip'
import {
  getModelByPage, run, runAll
} from '@/api/task/dwjc'
import { saveAs } from 'file-saver'
import {
  getStatCount, recordPV
} from '@/api/common/index'
import {
  mapGetters
} from 'vuex'
import { getToken } from '@/utils/auth'
import html2canvas from 'html2canvas'
import axios from 'axios'

export default {
  name: 'ObjectDetection',
  components: {
    Table
  },
  data() {
    return {
      is_Open: false,
      loadingImg: '',
      is_detect: false,
      percentage: 0,
      progressStatus: false,
      fileList: [],
      isUpload: false,
      dwjc_nums: 0,
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
      dwjc_img_list_results: null,
      dwjc_all_run: false,
      headers: {
        'Authorization': getToken()
      },
      map: null
    }
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'dwjc_img_list',
      'user',
      'dwjc_img_list_result',
      'loading_img_path'
    ])
  },
  watch: {
    dwjc_img_list_result(newVal, oldVal) {
      this.dwjc_img_list_results = newVal
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
    this.dwjc_img_list_results = this.dwjc_img_list_result
    //  获取最新的运行统计
    // getStatCount(5).then(res => {
    //   this.dwjc_nums = res.count
    // })
    this.initHtml2canvas()
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

    var index = Math.floor((Math.random() * this.loading_img_path.length))
    this.loadingImg = require('@/assets/loading/' + this.loading_img_path[index])
  },
  updated: function() {
    if (this.map == null && this.is_Open) {
      console.log('地图更新......')
      this.initMap()
    }
  },
  methods: {
    // 1.将base64转成Blob
    dataUrlToBlob(dataUrl) {
      let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        // arr[0]是data:image/png;base64
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      let imgFile = new Blob([u8arr], {
        type: mime
      })
      return imgFile
    },
    //2,再将blob转换为file
    blobToFile(theBlob, fileName) {
      theBlob.lastModifiedDate = new Date()  // 文件最后的修改日期
      theBlob.name = fileName                // 文件名
      return new File([theBlob], fileName, { type: theBlob.type, lastModified: Date.now() })
    },
    //截图
    screenShot() {
      const element = document.getElementById('screen')
      const options = {
        useCORS: true,
        // preserveDrawingBuffer: true,
        //foreignObjectRendering: true,
        allowTaint: true
      }
      html2canvas(element, options).then(canvas => {
        const png = canvas.toDataURL('image/png') //拿到截图后转换为png图片
        //base64转换成二进制流
        // this.$message.success('已截图')
        var blob = this.dataUrlToBlob(png)
        console.log('二进制转文件')
        var file = this.blobToFile(blob, 'file.png')
        console.log('文件上传')
        this.uploadFile(file)
        // const img = document.createElement('img')
        // img.setAttribute('src', png)
        // window.document.body.appendChild(img) //将png图片添加到页面验证
        // console.log('png:', png)
        // this.downLoadMap(png)
      })
    },
    //上传截图
    uploadFile(blob) {
      const formData = new FormData()
      formData.append('file', blob)
      axios({
        method: 'post',
        url: 'http://10.19.3.6:8000/localStorage/pictures',
        data: formData,
        headers: {
          'Authorization': getToken(),
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        console.log('res')
        console.log(res)
        this.$store.dispatch('set_img_to_dwjc', res.data.path)
        this.$message.success('已上传')
      })
    },
    //初始化
    initHtml2canvas() {
      this.$nextTick(() => {
        // 解决html2canvas截图空白问题
        HTMLCanvasElement.prototype.getContext = function(origFn) {
          return function(type, attributes) {
            if (type === 'webgl') {
              attributes = Object.assign({}, attributes, {
                preserveDrawingBuffer: true
              })
            }
            return origFn.call(this, type, attributes)
          }
        }(HTMLCanvasElement.prototype.getContext)
      })
    },
    //下载截图
    downLoadMap(png) {
      //创建一个a标签
      var a = document.createElement('a')
      //指定下载文件名称
      a.href = png
      a.download = '截图'
      //a 标签 需要点击触发。所以强制给他分派一个点击事件
      //创建一个鼠标事件
      let event = document.createEvent('MouseEvents')
      // 初始化鼠标事件
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      // 指定元素对象触发事件
      a.dispatchEvent(event)
    },
    openMap() {
      this.is_Open = true
    },
    //
    initMap() {
      // 百度地图API功能
      this.map = new BMap.Map('map') // 创建Map实例
      this.map.centerAndZoom(new BMap.Point(116.324662, 39.961028), 20) // 初始化地图,设置中心点坐标和地图级别
      //添加地图类型控件
      //       map.addControl(
      //         new BMap.MapTypeControl({
      //           mapTypes: [BMAP_NORMAL_MAP, BMAP_SATELLITE_MAP],
      //         })
      //       );
      this.map.setMapType(BMAP_SATELLITE_MAP)
      this.map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
      this.map.enableScrollWheelZoom(true)
    },
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
    detect(img) {
      if (img === undefined) {
        this.showHelp = true
        this.$message.warning('未检测到图片，请上传图片')
        return
      }
      this.$confirm('是否开始分类?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.showHelp = false
        let types = this.soloTask ? 0 : 1
        let modelIds = this.soloTask ? 0 : this.nowModel.modelId
        let userId = this.user ? this.user.id : null
        // 随机获取一个load动画
        var index = Math.floor((Math.random() * this.loading_img_path.length))
        this.loadingImg = require('@/assets/loading/' + this.loading_img_path[index])
        this.is_detect = true

        run(img, 0, 0, userId).then(res => {
          this.$store.dispatch('set_img_to_dwjc_result', res.img_result_url)
          this.$message.success('提取完毕')

        }).catch(err => {
          this.$message.error('提取异常')
          this.is_detect = false
        })
        //记录运行次数
        recordPV(5).then(res => {
          this.dwjc_nums = res.count
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
      this.$store.dispatch('set_img_to_dwjc', response.path)
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
      this.$store.dispatch('del_img_to_dwjc_all')
      this.is_img1 = false
      this.is_img2 = false
      this.dwjc_img_list_results = null
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
      if (this.dwjc_img_list.length === 0) {
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
        runAll(this.dwjc_img_list, 1, modelIds, userId).then(res => {
          this.dwjc_all_run = true
          this.$store.dispatch('set_img_to_dwjc_result_all', res.img_result_urls)
          this.$message.success('分类完毕')
        }).catch(err => {
          this.$message.error('地物分类运行异常')
        })

      }).catch(() => {

      })
    },
    loadFileList() {
      let arr = this.dwjc_img_list_result.map((item, i) => {
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
        getModelByPage(4, this.page, this.size).then((res) => {
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

      if (this.dwjc_all_run) {
        this.$store.dispatch('del_img_to_dwjc_all')
      }
      this.$store.dispatch('set_img_to_dwjc', response.path)
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
  animation-duration: 1s;
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
> > > .anchorBL {
  display: none;
}
</style>
