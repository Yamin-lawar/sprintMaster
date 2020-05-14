import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Sprint from '../components/Sprint.vue'
import TeamList from '../components/TeamList.vue'
import AddTeam from '../components/AddTeam.vue'

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
  },
  {
    path: '/team',
    name: 'TeamList',
    component: TeamList
  },
  {
    path: '/add-team',
    name: 'AddTeam',
    component: AddTeam
  }
]

const router = new VueRouter({
  routes
})

export default router
