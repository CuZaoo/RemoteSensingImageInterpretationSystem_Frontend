<template>
  <div>
    <el-table :data="dwjc_img_list_results" style="width: 100%" max-height="600"
              @selection-change="handleSelectionChange"
    >
      <template slot="empty">
        <el-empty :image-size="100" description="点击上传图片按钮增加数据"></el-empty>
      </template>
      <el-table-column label="图片1" :width="280">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="点击图片查看大图" placement="top">
            <el-image
              :preview-src-list="[scope.row.img]"
              :src="scope.row.img"
              fit="fill"
            ></el-image>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="处理图" :width="280">
        <template slot-scope="scope">
          <div v-if="scope.row.result === null || scope.row.result === undefined" class="centerVertically">
            <el-empty :image-size="100" description="暂无结果"></el-empty>
          </div>
          <div v-else style="overflow: auto">
            <el-tooltip class="item" effect="dark" content="点击图片查看处理大图" placement="top">
              <el-image
                :preview-src-list="[scope.row.result]"
                :src="scope.row.result"
                fit="fill"
              ></el-image>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="模型" align="right">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="选择处理单个图片的模型" placement="top">
            <el-select v-model="selectedModelID[scope.$index]" placeholder="待运行模型" popper-class="selectJob"
                       @change="selectChange"
                       @visible-change="getTableList"
            >
              <el-option
                v-for="model in selectableModels"
                :key="model.modelId"
                :label="model.name"
                :value="model.modelId"
              />
              <div style="text-align:center">
              <span
                class="text"
                @click.stop="prePage"
              >上一页</span>
                <span
                  class="text"
                  @click.stop="nextPage"
                >下一页</span>
              </div>
            </el-select>
          </el-tooltip>

        </template>
      </el-table-column>
      <el-table-column align="right" label="运行">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="运行" placement="top">
            <el-button type="success" icon="el-icon-s-promotion" plain @click="detect(scope.$index,scope.row.img)"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="" :show-close="false" :visible.sync="isEnlargeImage" class="roll-dialog"
               :modal-append-to-body="false" top="1%"
               width="60%"
    >
      <div>
        <img :src="enlargeImage" @click="isEnlargeImage = false"></img>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import { getModelByPage } from '@/api/task/bhjc'
import {
  mapGetters
} from 'vuex'
import { run } from '@/api/task/dwjc'
import { recordPV } from '@/api/common'

export default {
  data() {
    return {
      isEnlargeImage: false, // 放大图片
      enlargeImage: '', // 放大图片地址
      windowWidth: document.documentElement.clientWidth, // 获取屏幕宽度
      windowHeight: document.documentElement.clientHeight, // 获取屏幕高度
      fileList: [],
      selectableModels: ['UNet', 'BIT'],
      selectedModelID: [],
      total: null, // 获取总数据量
      page: 1, // 获取总页数
      size: 6, // 当前页数
      pageCount: 2,
      dwjc_img_list_results: []
    }
  },
  computed: {
    ...mapGetters([
      'dwjc_img_list',
      'imagesUploadApi',
      'user',
      'baseApi',
      'dwjc_img_list_result'
    ])
  },
  watch: {
    dwjc_img_list_result(newVal, oldVal) {
      console.log('上传完图片')
      this.dwjc_img_list_results = this.dwjc_img_list_results.map((item, i) => {
        this.$set(item, 'result', newVal[i])
        console.log(item)
        return item
      })
    },
    dwjc_img_list(newVal, oldVal) {
      console.log('上传完图片2')
      this.dwjc_img_list_results = newVal.map(item => {
        return { img: item }
      })
    }
  },
  methods: {
    handleFileEnlarge(_url) { // 放大图片
      if (_url) {
        this.enlargeImage = _url
        this.isEnlargeImage = !this.isEnlargeImage
      }
    },
    loadFileList() {

    },
    handleSelectionChange() {

    },
    detect(index, img) {
      this.$confirm('是否处理当前图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (img === undefined) {
          this.showHelp = true
          this.$message.warning('未检测到图片，请上传图片')
          return
        }

        //思路：
        // 1.多图单运行：前端向后端传送图的数组索引，图的url
        //后端：使用图的索引和url，url负责预测并返回图片，索引负责找到对应原图，后端返回一个对象，对象包含index和url
        //前端回显需要修改的地方，dwjc_img_list，不再是一个普通数组，而是一个包含对象的数组
        //2.多图全部运行：
        //前端需要传参，一个包含对象的数组，对象包含图的index，图的url
        // 后端接受参数，通过for循环将url逐个处理
        //后端返回一个数组包含对象，前端应该直接将接受的数组取代dwjc_img_list
        this.showHelp = false
        let types = this.soloTask ? 0 : 1
        if (this.nowModel === undefined) {
          this.$message.warning('未选择模型')
          return
        }
        let modelIds = this.nowModel.modelId
        let userId = this.user ? this.user.id : null
        run(img, types, modelIds, userId).then(res => {
          console.log('单个检测')
          console.log(index)
          console.log(res)
          this.$store.dispatch('set_img_to_dwjc_result_index', {
            'index': index,
            'url': res.img_result_url
          })
          this.$message.success('提取完毕')
        }).catch(err => {
          this.$message.info(err)
          // this.$message.error('提取异常')
        })
        //记录运行次数
        recordPV(5).then(res => {
          this.dwjc_nums = res.count
        })
      })
    },
    handleDelete(index, data) {

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
          console.log(error)
        })
      }
    },
    selectChange(value) {
      this.nowModel = this.selectableModels.find(val => val.modelId === value)
    },
    exceed() {
      this.$message.info('最多一次上传10张')
    }
  },
  mounted() {
    this.dwjc_img_list_results = this.dwjc_img_list.map(item => {
      return { img: item }
    })

    this.dwjc_img_list_results = this.dwjc_img_list_results.map((item, i) => {
      this.$set(item, 'result', this.dwjc_img_list_result[i])
      return item
    })
  }
}
</script>

<style lang="scss">
.roll-dialog .el-dialog__body {
  padding: 3px 30px;
  overflow-y: auto;
  height: calc(100vh - 140px);
}


.add_file {
  border: 10px #000 red;
  text-align: center;
  width: 120px;
  height: 120px;
}

.table_img {
  width: 255px;
  height: 255px;
}

.avatar-uploader .el-upload {

  border: 1px dashed #55ff00;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.selectJob {
  span {
    width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text {
    padding-left: 10px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    color: cornflowerblue;
    user-select: none;
  }

  .text:hover {
    color: rgb(120, 133, 158);
  }
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 255px;
  height: 255px;
  line-height: 255px;
  text-align: center;
}

.avatar {
  width: 255px;
  height: 255px;
  display: block;
}
</style>
