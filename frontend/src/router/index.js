import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Sprint from '../components/Sprint.vue'
import TeamList from '../components/TeamList.vue'
import AddTeam from '../components/AddTeam.vue'
import UserList from '../components/UserList.vue'
import Projects from '../components/Projects.vue'
import SprintList from '../components/SprintList.vue'
import AuthGuard from '../utils/AuthGuard'
import ActiveSprint from '../components/ActiveSprint.vue'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/sprint/active',
    name: 'Sprint',
    component: Sprint,
    beforeEnter: AuthGuard
  },
  {
    path: '/team',
    name: 'TeamList',
    component: ActiveSprint,
    beforeEnter: AuthGuard
  },
  {
    path: '/add-team',
    name: 'AddTeam',
    component: AddTeam,
    beforeEnter: AuthGuard
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList,
    beforeEnter: AuthGuard
  },
  {
    path: '/projects',
    name: 'prjects',
    component: Projects,
    beforeEnter: AuthGuard
  },
  {
    path: '/sprint',
    name: 'sprint-list',
    component: SprintList,
    beforeEnter: AuthGuard
  },
  
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
