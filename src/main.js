import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引入element.js
import '@/utils/elem.js'
// import ElementUI from 'element-ui'
import '@/assets/css/gong.css'
// 引入axios
import '@/utils/axs.js'

Vue.config.productionTip = false
// Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
