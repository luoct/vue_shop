import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'

Vue.config.productionTip = false

axios.defaults.baseURL = 'http://139.9.202.95:8888/api/private/v1'
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)
Vue.filter('dateFormat', (originVal) => {
  const dt = new Date(originVal)
  return dt.toLocaleString()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
