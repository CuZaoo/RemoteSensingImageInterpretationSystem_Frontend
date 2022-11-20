<template>
  <el-container>
    <el-row>
      <el-col>
        <el-upload
                :action="imagesUploadApi"
                :show-file-list="false"
                :on-success="uploadSuccess1"
              >
                <el-button
                  type="primary"
                  style="width:100%"
                >上传图片</el-button>
              </el-upload>

      </el-col>
    </el-row>


  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      windowWidth: document.documentElement.clientWidth, // 获取屏幕宽度
      windowHeight: document.documentElement.clientHeight, // 获取屏幕高度
    }
  },
  methods: {
    delFile(index) {
      this.$store.dispatch('del_img_to_bhjc',index)
      // this.fileList.splice(index, 1)
    },
    handlePreview(file) {
      console.log(file)
    },
    loadFileList() {

    },
    handleChange(file, fileList) {
      console.log(file)
      console.log(fileList)
    },
    uploadSuccess1(response, file, fileList) {
      console.log('上传文件成功1')
      this.$store.dispatch('set_img_to_bhjc1',file)
      // this.fileList.push(file)
    },
    
  },
  computed: {
    ...mapGetters([
      'imagesUploadApi',
      'baseApi',
    ])
  }
}
</script>
<style lang="scss" scoped>
.add_file{
    border: 10px #000 red;
    text-align: center;
    width:120px;height:120px;
}
.table_img{
    width: 255px;
    height: 255px;
}
</style>
