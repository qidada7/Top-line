import Vue from 'vue'
import axios from 'axios'
// import 'element-ui/lib/theme-chalk/index.css'
import router from '@/router'
import JSONbig from 'json-bigint'

axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'// 设置根地址
// 设置请求拦截器
Vue.prototype.$http = axios// 配置为vue成员
// axios.interceptors.request.use(function (config) {
//   let userinfo = window.sessionStorage.getItem('shou')// 获取传过来的 对象
//   if (userinfo) { // 如果有传过来的对象  ，那就请求的时候执行以下代码
//     config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token// 前面是 必须要传的参数   对应后面的格式，详情见接口文档
//   }

//   return config // 如果没有对象 就返回
// }, function (error) {
//   return Promise.reject(error)
// })
// 配置请求拦截器
axios.interceptors.request.use(function (config) {
  // 发送请求的相关逻辑
  // config:对象  与 axios.defaults 相当
  // 借助config配置token
  let userinfo = window.sessionStorage.getItem('shou')
  // 判断token存在再做配置
  if (userinfo) {
    let token = JSON.parse(userinfo).token
    // 注意：token前边有 'Bearer ' 的信息前缀
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// 配置响应拦截器

axios.interceptors.response.use(function (res) {
  // 如果出现401 报错 ，就返回登录页面

  return res
}, function (error) {
  if (error.response.status === 401) { // 如果出现token为空，或者 token过期，就会出现401报错 那么就跳转回登录页面
    router.push('/login')
    // return new Promise(function () {})
    // 如果不想让显示错误信息  就执行上面的代码
  }
  return Promise.reject(error)
})
// 配置数据转换器  因为转的id字符串太大 需要用处理
axios.defaults.transformResponse = [function (data) {
  if (data) { // 如果有data
    return JSONbig.parse(data)
  } else {
    return data
  }
}]
