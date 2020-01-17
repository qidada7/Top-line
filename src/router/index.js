import Vue from 'vue'
import VueRouter from 'vue-router'
import Nprogress from 'nprogress' // 引入nprogress
import 'nprogress/nprogress.css'// 引入nprogresscss文件

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/', redirect: '/login' },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/views/home'),
    redirect: '/welcome', // 重定向
    children: [
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') },
      { path: '/toto', name: 'toto', component: () => import('@/views/toto') }, // 添加文章路由
      { path: '/xiu/:aid', name: 'xiu', component: () => import('@/views/xiu') }, // 修改文章路由
      { path: '/self', name: 'self', component: () => import('@/views/self') }, // 修改个人信息
      { path: '/material', name: 'material', component: () => import('@/views/material') }, // 图片素材
      { path: '/fans', name: 'fans', component: () => import('@/views/fans') }// 粉丝管理
    ]
  }

]

const router = new VueRouter({
  routes
})
// 前置守卫
router.beforeEach((to, from, next) => {
  Nprogress.inc()// 开启进度条
  let shou = window.sessionStorage.getItem('shou')// 接受shou，并进行判断
  if (!shou && to.path !== '/login') { // 如果该JSON字符串为false 或者访问的不是登录页面，那就强制返回登录页面
    return next('/login')
  }
  next()
})
// 后置守卫
router.afterEach((to, from, next) => {
  Nprogress.done()// 关闭进度条
})

export default router
