import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import '@/assets/css/gong.css'
import axios from 'axios'
// import 'element-ui/lib/theme-chalk/index.css'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'// 设置根地址
Vue.prototype.$http = axios// 配置为vue成员
Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
