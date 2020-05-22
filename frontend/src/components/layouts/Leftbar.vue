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
                <a href="#"><b-icon icon="bullseye"></b-icon><span class="menu-title">Active Sprint</span></a>
            </li>
            <li>
                <a href="#"><b-icon icon="card-checklist"></b-icon><span class="menu-title">Sprints</span></a>
               
            </li>
            <li>
                <a href="/project"><b-icon icon="layout-text-sidebar"></b-icon><span class="menu-title">Projects</span></a>
            </li>
            <li>
                <a href="/team"><b-icon icon="people-fill"></b-icon><span class="menu-title">Team</span></a>
            </li>
            <li>
                <a href="/users"><b-icon icon="people-circle"></b-icon><span class="menu-title">Users</span></a>
            </li>
            <li>
                <a href="#"><b-icon icon="power"></b-icon><span class="menu-title">Logout</span></a>
            </li>
        </ul>

    </nav>
    </div>
</template>

<script>
export default {
    name:"Leftbar"
}
</script>

<style scoped>
@import '../..//css/menubar.css';
</style>