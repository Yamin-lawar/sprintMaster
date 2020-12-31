<template>
  <div id="app">
    <div> 
      <Header/>
      <notifications group="sprint" position='top' width="300px"/>
      <vue-confirm-dialog></vue-confirm-dialog>
    </div>
    <div v-if="$route.name != 'Login'">
      <Leftbar/>
    </div>
    <div>
      <router-view/>
    </div>  
    <Footer/>
  </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue'
import Footer from '@/components/layouts/Footer.vue'
import Leftbar from '@/components/layouts/Leftbar.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import 'vue-good-table/dist/vue-good-table.css'


export default {
  components:{
    Header,
    Footer,
    Leftbar
  },
  
}
</script>

<style lang="scss">
@import './scss/app.scss';
@import './css/style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;
}

</style>
