<template>
    <div class="wrapper">
         <nav id="sidebar">
        <div class="sidebar-header">
            <h3>Sprint Master</h3>
        </div>

        <ul class="list-unstyled components">
            <li class="active">
                <a> <b-icon icon="display"></b-icon><span class="menu-title">Dashboard</span></a>
               
            </li>
            <li>
                <RouterLink :to="'/sprint/active'"><b-icon icon="bullseye"></b-icon><span class="menu-title">Active Sprint</span></RouterLink>
            </li>
            <li>
                <RouterLink :to="'/sprint'"><b-icon icon="card-checklist"></b-icon><span class="menu-title">Sprints</span></RouterLink>
               
            </li>
            <li>
                <RouterLink :to="'/project'"><b-icon icon="layout-text-sidebar"></b-icon><span class="menu-title">Projects</span></RouterLink>
            </li>
            <li>
                <RouterLink :to="'/team'"><b-icon icon="people-fill"></b-icon><span class="menu-title">Team</span></RouterLink>
            </li>
            <li>
                <RouterLink :to="'/users'"><b-icon icon="people-circle"></b-icon><span class="menu-title">Users</span></RouterLink>
            </li>
            <li>
                <a href="javascript:void(0)" v-on:click="logoutAction"><b-icon icon="power"></b-icon><span class="menu-title">Logout</span></a>
            </li>
        </ul>

    </nav>
    </div>
</template>

<script>
import router from '../../router'
export default {
    name:"Leftbar",
    methods:{
      logoutAction(){
          //logout the current user and reset all the local storage
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          router.push({ name: "Login"}) 
      }
    },
}
</script>

<style scoped>
@import '../..//css/menubar.css';
</style>