// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'


// 导入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 将弹框提示组件挂载到全局
import { Message } from 'element-ui'
Vue.prototype.$message = Message

// 导入树形结构表格
import treeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', treeTable)

// 导入全局样式
import './assets/css/global.css'

// 导入富文本编译器
import VueQuillEditor from 'vue-quill-editor'
// 富文本样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor)

//导入进度条 NProgress.start()， NProgress.done()
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
// axios.defaults.baseURL='https://www.liulongbin.top:8888/api/private/v1/'
 axios.defaults.baseURL='http://rambuild.cn:8888/api/private/v1/'

// 请求拦截----------------
axios.interceptors.request.use(config=>{
  console.log(config)
  NProgress.start()
  config.headers.Authorization = sessionStorage.getItem('token')
  // 后面所有请求必须携带请求头
  // 最后必须把config返回---
  return config
})

// 响应拦截----------------
axios.interceptors.response.use(config=>{
  NProgress.done()
 
  // 最后必须把config返回---
  return config
})

Vue.prototype.$http = axios

Vue.config.productionTip = false

/* eslint-disable no-new */

// 创建一个全局时间过滤器
Vue.filter('dataFormate',(originVal)=>{
 const dt=new Date(originVal)
 const y=dt.getFullYear()
 const m=(dt.getMonth()+1+'').padStart(2,'0')
 const d=(dt.getDate()+'').padStart(2,'0')

 const hh=(dt.getHours()+'').padStart(2,'0')
 const mm=(dt.getMinutes()+'').padStart(2,'0')
 const ss=(dt.getSeconds()+'').padStart(2,'0')

 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})



new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
