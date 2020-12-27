<template>
  <div class="l-navbar" id="navbar">
    <b-icon
      class="hamburger" icon="list"
      @click="show = !show;openSideMenu();"
    ></b-icon>
    <nav id="sidebar" class="nav" v-bind:class="{ show: show }">
      <ul class="list-unstyled components nav__list nav__navbar">
        <li class="nav__item">
          <a class="nav__link">
            <b-icon icon="display"></b-icon>
            <span class="menu-title">Dashboard</span>
          </a>
        </li>
        <li class="nav__item" v-on:click="applyActive('activeSprint')">
          <RouterLink
            :to="'/sprint/active'"
            :class="['nav__link', activeMenu == 'activeSprint' ? 'active' : '']"
          >
            <b-icon icon="bullseye"></b-icon>
            <span class="menu-title">Active Sprint</span>
          </RouterLink>
        </li>
        <li class="nav__item" v-on:click="applyActive('sprint')">
          <RouterLink
            :to="'/sprint'"
            :class="['nav__link', activeMenu == 'sprint' ? 'active' : '']"
          >
            <b-icon icon="card-checklist"></b-icon>
            <span class="menu-title">Sprints</span>
          </RouterLink>
        </li>
        <li class="nav__item" v-on:click="applyActive('project')">
          <RouterLink
            :to="'/project'"
            :class="['nav__link', activeMenu == 'project' ? 'active' : '']"
          >
            <b-icon icon="layout-text-sidebar"></b-icon>
            <span class="menu-title">Projects</span>
          </RouterLink>
        </li>
        <li class="nav__item" v-on:click="applyActive('team')">
          <RouterLink
            :to="'/team'"
            :class="['nav__link', activeMenu == 'team' ? 'active' : '']"
          >
            <b-icon icon="people-fill"></b-icon>
            <span class="menu-title">Team</span>
          </RouterLink>
        </li>
        <li class="nav__item" v-on:click="applyActive('user')">
          <RouterLink
            :to="'/users'"
            :class="['nav__link', activeMenu == 'user' ? 'active' : '']"
          >
            <b-icon icon="person-circle"></b-icon>
            <span class="menu-title">Users</span>
          </RouterLink>
        </li>
        <li class="nav__item">
          <a
            href="javascript:void(0)"
            class="nav__link"
            v-on:click="logoutAction"
          >
            <b-icon icon="power"></b-icon>
            <span class="menu-title">Logout</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import router from "../../router";
export default {
  name: "Leftbar",
  data() {
    return {
      show: false,
      activeMenu: null,
    };
  },
  methods: {
    logoutAction() {
      //logout the current user and reset all the local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      router.push({ name: "Login" });
    },
    openSideMenu() {
      document.getElementById("wrapper")
        ? document.getElementById("wrapper").classList.toggle("expander")
        : null;
    },
    applyActive(value) {
      this.show = false;
      this.activeMenu = value;
      document.getElementById("wrapper") &&
        document.getElementById("wrapper").classList.contains("expander") &&
        document.getElementById("wrapper").classList.remove("expander");
    },
  },
};
</script>

<style scoped>

</style>