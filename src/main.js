// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// 192.168.47.63
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/common.css'
import App from './App'
import router from './router'
import axios from 'axios'
// 配置axios实例
const base = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1/'
})
const token = localStorage.getItem('token')
// 在请求头中添加token值
if (token) {
  base.defaults.headers.common['Authorization'] = token
}
Vue.prototype.axios = base

Vue.use(ElementUI)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
