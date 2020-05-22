import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Sprint from '../components/Sprint.vue'
import TeamList from '../components/TeamList.vue'
import AddTeam from '../components/AddTeam.vue'
import UserList from '../components/UserList.vue'
import Projects from '../components/Projects.vue'

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
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList
  },
  {
    path: '/projects',
    name: 'prjects',
    component: Projects
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
