import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由页面的懒加载，需要哪个页面再去请求那个页面
const routes = [
  {
    path: '/login',
    component: () => import('@/views/Login')
  }
]

const router = new VueRouter({
  routes
})

export default router
