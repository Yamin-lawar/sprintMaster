import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Sprint from '../components/Sprint.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/sprint',
    name: 'Sprint',
    component: Sprint
  }
]

const router = new VueRouter({
  routes
})

export default router
