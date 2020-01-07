import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home', name: 'home', component: () => import('@/views/home') }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  let shou = window.sessionStorage.getItem('shou')// 接受shou，并进行判断
  if (!shou && to.path !== '/login') { // 如果该JSON字符串为false 或者访问的不是登录页面，那就强制返回登录页面
    return next('/login')
  }
  next()
})
export default router
