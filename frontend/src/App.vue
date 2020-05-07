<template>
  <div id="app">
    <Header/>
    <Leftbar/>
    
    <router-view/>
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


export default {
  components:{
    Header,
    Footer,
    Leftbar
  }
}
</script>

<style>
@import './css/style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

</style>
