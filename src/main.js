import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'

// 数据字典
import dict from './components/Dict'

// 权限指令
import checkPer from '@/utils/permission'
import permission from './components/Permission'
import './assets/styles/element-variables.scss'

// global css
import './assets/styles/index.scss'

import App from './App'
import store from './store'
import router from './router/routers'

import './assets/icons' // icon
import './router/index' // permission control
Vue.use(checkPer)
Vue.use(permission)
Vue.use(dict)
Vue.use(Element, {
  size: Cookies.get('size') || 'small' // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

import {
  recordPV
} from '@/api/common/index'

//网站访客数
router.afterEach((to, from, next) => {
  if (to.path === '/dashboard') {
    recordPV(1).then(res => {
      store.dispatch('setStatPv', res.count)
    })
  }
})

//加载loading 动画
let files = require.context('@/assets/loading/', false, /.gif$/)
let path = require('path')
let arr = []
files.keys().forEach(key => {
  let name = path.basename(key)
  arr.push(name)
})
store.dispatch('setLoadingImgPath', arr)
