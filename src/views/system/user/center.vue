<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="5" style="margin-bottom: 10px">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <div class="el-upload">
                <img :src="user.avatarName ? baseApi + '/avatar/' + user.avatarName : Avatar" title="点击上传头像"
                     class="avatar" @click="toggleShow"
                >
                <myUpload
                  v-model="show"
                  :headers="headers"
                  :url="updateAvatarApi"
                  @crop-upload-success="cropUploadSuccess"
                />
              </div>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login"/>
                  登录账号
                  <div class="user-right">{{ user.username }}</div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1"/>
                用户昵称
                <div class="user-right">{{ user.nickName }}</div>
              </li>
              <li>
                <svg-icon icon-class="user1"/>
                用户权限
                <div class="user-right">{{ user.isAdmin ? '管理员' : '普通用户' }}</div>
              </li>
              <li>
                <svg-icon icon-class="phone"/>
                手机号码
                <div class="user-right">{{ user.phone }}</div>
              </li>
              <li>
                <svg-icon icon-class="email"/>
                用户邮箱
                <div class="user-right">{{ user.email }}</div>
              </li>
              <li>
                <svg-icon icon-class="anq"/>
                安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">修改密码</a>
                  <!--                  <a @click="$refs.email.dialog = true">修改邮箱</a>-->
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="19">
        <!--    用户资料    -->
        <el-card class="box-card">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="用户资料" name="first">
              <el-form ref="form" :model="form" :rules="rules" style="margin-top: 10px;" size="small"
                       label-width="65px"
              >
                <el-form-item label="昵称" prop="nickName">
                  <el-input v-model="form.nickName" style="width: 35%"/>
                  <span style="color: #C0C0C0;margin-left: 10px;">用户昵称不作为登录使用</span>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" style="width: 35%;"/>
                  <span style="color: #C0C0C0;margin-left: 10px;">手机号码不能重复</span>
                </el-form-item>
                <el-form-item label="性别">
                  <el-radio-group v-model="form.gender" style="width: 278px">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                    <el-radio label="外星人">外星人</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="">
                  <el-button :loading="saveLoading" size="mini" type="primary" @click="doSubmit">保存配置</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="操作日志" name="second">
              <el-table v-loading="loading" :data="data" style="width: 100%;">
                <el-table-column prop="description" label="行为"/>
                <el-table-column prop="requestIp" label="IP"/>
                <el-table-column :show-overflow-tooltip="true" prop="address" label="IP来源"/>
                <el-table-column prop="browser" label="浏览器"/>
                <el-table-column prop="time" label="请求耗时" align="center">
                  <template slot-scope="scope">
                    <el-tag v-if="scope.row.time <= 300">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else-if="scope.row.time <= 1000" type="warning">{{ scope.row.time }}ms</el-tag>
                    <el-tag v-else type="danger">{{ scope.row.time }}ms</el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                >
                  <template slot="header">
                    <div style="display:inline-block;float: right;cursor: pointer" @click="init">创建日期<i
                      class="el-icon-refresh" style="margin-left: 40px"
                    /></div>
                  </template>
                  <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <el-pagination
                :total="total"
                :current-page="page + 1"
                style="margin-top: 8px;"
                layout="total, prev, pager, next, sizes"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </el-tab-pane>

            <el-tab-pane v-if="user.isAdmin" label="模型管理" name="third">
              <el-table :data="modelData" style="width: 100%;">
                <el-table-column prop="name" label="模型名称"/>
                <el-table-column prop="type" label="类型"/>
                <el-table-column prop="time" label="运行次数"/>
                <el-table-column prop="url" label="年份" align="center">
                  <template slot-scope="scope">
                    <el-tag>{{ scope.row.year }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="url" label="url" align="center">
                  <template slot-scope="scope">
                    <el-link type="primary" :href="scope.row.url" target="_blank" :underline="false">{{
                        scope.row.url
                      }}
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="miou" label="MIOU"/>
                <el-table-column prop="f1" label="F1"/>
                <el-table-column
                  label="创建日期"
                >
                  <template slot-scope="scope">
                    <span>{{ scope.row.createTime }}</span>
                  </template>
                </el-table-column>
                <el-table-column align="right" label="操作">
                  <template slot-scope="scope">
                    <el-button type="danger" @click="delModel(scope.row.modelId)">
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--分页组件-->
              <el-pagination
                background
                :total="modelTotal"
                :current-page="modelPage"
                style="margin-top: 8px;"
                @current-change="currentModelChange"
              />
            </el-tab-pane>

            <el-tab-pane v-if="user.isAdmin" label="模型上传" name="fourth">
              <el-form ref="modelForm" :rules="modelRules" :model="modelForm" label-width="80px">
                <el-form-item label="模型名称" prop="name">
                  <el-input v-model="modelForm.name" style="width: 55%"></el-input>
                  <span style="color: #C0C0C0;margin-left: 10px;">模型名称请使用数字和字母，推荐全部大写</span>
                </el-form-item>
                <el-form-item label="模型类型" prop="type">
                  <el-select v-model="modelForm.type" placeholder="请选择模型所属类型">
                    <el-option
                      v-for="type in types"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="模型平台" prop="type">
                  <el-select v-model="modelForm.platform" placeholder="请选择模型参数所属平台">
                    <el-option
                      v-for="type in platform"
                      :key="type.value"
                      :label="type.label"
                      :value="type.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="运行次数" prop="time">
                  <el-input v-model="modelForm.time" type="number" style="width: 55%"></el-input>
                </el-form-item>
                <el-form-item label="论文年份" prop="year">
                  <el-select v-model="modelForm.year" @change="yearChange" placeholder="请选择">
                    <el-option
                      v-for="year in years"
                      :key="year.value"
                      :label="year.label"
                      :value="year.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="论文地址" prop="url">
                  <el-input v-model="modelForm.url" style="width: 55%"></el-input>
                  <span style="color: #C0C0C0;margin-left: 10px;">论文地址即URL</span>
                </el-form-item>
                <el-form-item label="MIOU/AP" prop="miou">
                  <el-input v-model="modelForm.miou" type="number" style="width: 55%"></el-input>
                </el-form-item>
                <el-form-item label="F1" prop="f1">
                  <el-input v-model="modelForm.f1" type="number" style="width: 55%"></el-input>
                  <span style="color: #C0C0C0;margin-left: 10px;">若没有数据则输入0</span>
                </el-form-item>
                <el-form-item label="模型文件">
                  <el-upload
                    class="upload-demo"
                    drag
                    multiple
                    :action="fileModelUploadApi"
                    :auto-upload="false"
                    ref="upload"
                    :headers="headers"
                    :file-list="fileList"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="uploadSuccess"
                    :before-upload="uploadBefore"
                    :on-error="uploadError"
                    :data="uploadParams"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击选择</em><div>最大文件限制300M</div></div>
                    <div class="el-upload__tip" slot="tip">至少上传模型和模型的python文件，<span
                      style="color: red"
                    >模型名应为model(如model.pth)，模型的Python文件名与模型名称一致，且文件中应该有get_model()函数返回模型</span>
                    </div>
                  </el-upload>
                  <el-button size="small" type="success" @click="submitUpload">立即创建</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <updatePass ref="pass"/>
  </div>
</template>

<script>
import myUpload from 'vue-image-crop-upload'
import { mapGetters } from 'vuex'
import updatePass from './center/updatePass'
import { getToken } from '@/utils/auth'
import store from '@/store'
import { isvalidPhone } from '@/utils/validate'
import crud from '@/mixins/crud'
import { editUser } from '@/api/system/user'
import Avatar from '@/assets/images/avatar.png'
import { uploadModel, deleteModel } from '@/api/common/index'
import { encrypt } from '@/utils/rsaEncrypt'

export default {
  name: 'Center',
  components: { updatePass, myUpload },
  mixins: [crud],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {

      types: [
        {
          value: 1,
          label: '目标提取'
        },
        {
          value: 2,
          label: '变化检测'
        },
        {
          value: 3,
          label: '目标检测'
        },
        {
          value: 4,
          label: '地物分类'
        }
      ],
      platform: [
        {
          value: 0,
          label: 'PyTorch'
        },
        {
          value: 1,
          label: 'Tensorflow'
        },
        {
          value: 2,
          label: 'PaddlePaddle'
        }
      ],
      modelForm: {
        year: '',
        name: '',
        type: '',
        platform: '',
        time: '',
        url: '',
        miou: '',
        f1: ''
      },
      modelRules: {
        name: [
          { required: true, trigger: 'blur', message: '模型名不可为空' }
        ],
        time: [
          { required: true, trigger: 'blur', message: '请设置模型运行次数' }
        ],
        url: [
          { required: true, trigger: 'blur', message: '请填写论文地址' }
        ],
        type: [
          { required: true, trigger: 'blur', message: '请选择模型类型' }
        ],
        year: [
          { required: true, trigger: 'blur', message: '请选择论文年份' }
        ],
        miou: [
          { required: true, trigger: 'blur', message: '请确保MIOU分数不为空' }
        ],
        f1: [
          { required: true, trigger: 'blur', message: '请确保F1分数不为空' }
        ]
      },
      uploadParams: {
        type: 1
      },
      fileList: [],
      years: [],
      modelData: [],
      modelPage: 1,
      modelAllPage: 0,
      modelSize: 10,
      modelTotal: 0,
      modelLoading: false,
      show: false,
      Avatar: Avatar,
      activeName: 'first',
      saveLoading: false,
      headers: {
        'Authorization': getToken()
      },
      form: {},
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user',
      'updateAvatarApi',
      'baseApi',
      'fileModelUploadApi'
    ])
  },
  created() {
    this.form = { id: this.user.id, nickName: this.user.nickName, gender: this.user.gender, phone: this.user.phone }
    console.log(this.form)
    store.dispatch('GetInfo').then((data) => {
    })
    this.initModelData()
    this.initYear()
  },
  methods: {
    handlePreview() {
    },
    handleRemove() {
    },
    uploadBefore(file) {
      if (file.size / 1024 / 1024 > 300) {
        this.$message.error('超出文件大小限制:' + file.size)
        return false
      }
      return true
    },
    uploadError(err, file, fileList) {
      this.$message.error('模型文件上传失败')
    },
    uploadSuccess(response, file, fileList) {
      this.$message.success('模型文件上传成功')
      this.fileList = []
      this.onSubmitModel()
    },
    delModel(modelId) {
      this.$confirm('确认删除当前模型吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteModel(modelId).then(res => {
          this.$message.success('删除成功')
          this.initModelData()
        })
      })
    },
    submitUpload() {
      this.$refs.modelForm.validate((valid) => {
        if (valid) {
          // if (this.fileList.length === 0){
          //   this.$message.warning("模型文件不可为空")
          //   return
          // }
          this.$confirm('确定创建模型吗(将在服务器创建对应文件夹)?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            this.uploadParams.type = this.modelForm.type
            this.uploadParams.name = this.modelForm.name
            this.$refs.upload.submit()
          })
        } else {
          this.$message.warning('请检查录入的数据')
          return false
        }
      })
    },
    currentModelChange(val) {
      this.modelPage = val
      console.log()
      this.initModelData()
    },
    initModelData() {
      store.dispatch('GetModels', { 'page': this.modelPage, 'size': this.modelSize }).then((res) => {
        var data = res.content
        data.map(item => {
          switch (item.type) {
            case 1:
              item.type = '目标提取'
              break
            case 2:
              item.type = '变化检测'
              break
            case 3:
              item.type = '目标检测'
              break
            case 4:
              item.type = '地物分类'
              break
          }
          return item
        })
        this.modelData = data
        this.modelTotal = res.totalElements
      })
    },
    initForm() {
      this.modelForm = {
        year: '',
        name: '',
        type: '',
        time: '',
        url: '',
        miou: '',
        f1: ''
      }
    },
    onSubmitModel() {
      this.loading = true
      uploadModel(this.modelForm)
        .then(() => {
          this.$message.success('模型添加成功')
          this.initForm()
        })
        .catch((err) => {
          this.loading = false
          this.$message.error(err)
        })
    },
    initYear() {
      var date = new Date
      var year = date.getFullYear()
      this.initSelectYear(year)
    },
    initSelectYear(year) {
      this.years = []
      for (let i = 0; i < 30; i++) {
        this.years.push({ value: (year - i), label: (year - i) + '年' })
      }
      console.log(this.years)
    },
    yearChange(value) {
      this.form.year = value
    },
    toggleShow() {
      this.show = !this.show
    },
    handleClick(tab, event) {
      if (tab.name === 'second') {
        this.init()
      }
    },
    beforeInit() {
      this.url = 'api/logs/user'
      return true
    },
    cropUploadSuccess(jsonData, field) {
      store.dispatch('GetInfo').then(() => {
      })
    },
    doSubmit() {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.saveLoading = true
            editUser(this.form).then(() => {
              this.editSuccessNotify()
              store.dispatch('GetInfo').then(() => {
              })
              this.saveLoading = false
            }).catch(() => {
              this.saveLoading = false
            })
          }
        })
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

.user-info {
  padding-left: 0;
  list-style: none;

  li {
    border-bottom: 1px solid #F0F3F4;
    padding: 11px 0;
    font-size: 13px;
  }

  .user-right {
    float: right;

    a {
      color: #317EF3;
    }
  }
}
</style>
