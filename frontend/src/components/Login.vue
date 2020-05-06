<template>
    <div>
      <div class="wrapper fadeInDown">
        <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="loader"></b-spinner>
        <div id="formContent">
        <!-- Top text -->
        <div class="fadeIn first">
          Enter your credential to login into the system
        </div>

        <!-- Login Form -->
        <form @submit="loginAuth">
          <input type="text" id="email" v-model="email" class="fadeIn second" name="email" placeholder="login">
          <input type="password" id="password" v-model="password" class="fadeIn third" name="password" placeholder="password">
          <input type="submit" class="fadeIn fourth" value="Log In">
        </form>

        <!-- Remind Passowrd -->
        <div id="formFooter">
          <a class="underlineHover" href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  </div>    
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
    name: "Login",
    computed: mapGetters(["users","loader"]),
    data(){
      return {
        email: '',
        password: ''
      }
    },
    methods:{
      ...mapActions(['loginAction']),
      loginAuth(e){
        e.preventDefault();
        console.log(this.email, this.password, 'check the form content')
        this.loginAction({email: this.email, password: this.password});
      }
    }
}
</script>

<style scoped>
@import '../css/login.css';
</style>