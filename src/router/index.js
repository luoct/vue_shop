import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '@/components/Login'
// import Home from '@/components/Home'
// import Welcome from '@/components/Welcome'
const Login = () => import(/* webpackChunkName: "group-index" */ '@/components/Login')
const Home = () => import(/* webpackChunkName: "group-index" */ '@/components/Home')
const Welcome = () => import(/* webpackChunkName: "group-index" */ '@/components/Welcome')

// import Users from '@/components/user/Users'
// import Rights from '@/components/power/Rights'
// import Roles from '@/components/power/Roles'
const Users = () => import(/* webpackChunkName: "group-user" */ '@/components/user/Users')
const Rights = () => import(/* webpackChunkName: "group-user" */ '@/components/power/Rights')
const Roles = () => import(/* webpackChunkName: "group-user" */ '@/components/power/Roles')

// import Cate from '@/components/goods/Cate'
// import Params from '@/components/goods/Params'
// import List from '@/components/goods/List'
// import Add from '@/components/goods/Add'
const Cate = () => import(/* webpackChunkName: "group-goods" */ '@/components/goods/Cate')
const Params = () => import(/* webpackChunkName: "group-goods" */ '@/components/goods/Params')
const List = () => import(/* webpackChunkName: "group-goods" */ '@/components/goods/List')
const Add = () => import(/* webpackChunkName: "group-goods" */ '@/components/goods/Add')

// import Order from '@/components/order/Order'
// import Report from '@/components/report/Report'
const Order = () => import(/* webpackChunkName: "group-o" */ '@/components/order/Order')
const Report = () => import(/* webpackChunkName: "group-o" */ '@/components/report/Report')






Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/home/welcome',
      children: [
        { path: 'welcome', component: Welcome },
        { path: 'users', component: Users },
        { path: 'rights', component: Rights },
        { path: 'roles', component: Roles },
        { path: 'categories', component: Cate },
        { path: 'params', component: Params },
        { path: 'goods', component: List },
        { path: 'add-goods', component: Add },
        { path: 'orders', component: Order },
        { path: 'reports', component: Report },
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})

export default router
