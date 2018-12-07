import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
const ChatIndex = () => import('@/components/ChatIndex')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/ChatIndex',
      name: 'ChatIndex',
      component: ChatIndex
    }
  ]
})
