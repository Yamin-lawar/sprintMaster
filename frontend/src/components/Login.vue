<template>
    <div id="login">
      <div class="login-wrapper">

        <header class="logo">
          <RouterLink :to="'/'" class="logo link"><span>SprintMaster</span></RouterLink>
        </header> 

        <div class="fadeInDown">
          <b-spinner variant="primary" style="width: 3rem; height: 3rem;" class="m-5 loader" label="Spinning" v-if="loader"></b-spinner>
          <div id="formContent">

            <!-- Top text -->
            <div class="fadeIn first top-title">
              Sign in to your account
            </div>

            <!-- Login Form -->
            <form @submit="loginAuth">
              <div class="form-input">
                <label for="email">Email</label>
                <input type="text" id="email" v-model="email" class="fadeIn second" name="email" placeholder="Enter email">
                <span class="error" v-if="$v.email.$dirty && !$v.email.required || !$v.email.email">Please enter email</span>
              </div>
              
              <div class="form-input">
                <label for="password">Password</label>
                <input type="password" id="password" v-model="password" class="fadeIn third" name="password" placeholder="Enter password">
                <span class="error" v-if="$v.password.$dirty && !$v.password.required">Please enter password</span>
              </div>
              
              <input type="submit" class="fadeIn fourth" value="Log In">
            </form>

            <!-- Remind Passowrd -->
            <div id="formFooter" class="form-footer">
              <a class="link" href="#">Forgot Password?</a>
            </div>
          </div>
        </div>
      </div>
  </div>    
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { required, email } from 'vuelidate/lib/validators'
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
        this.$v.$touch();
        if (this.$v.$invalid) {
            return;
        }
        this.loginAction({email: this.email, password: this.password});
      }
    },
    validations: {
      email: {
        required,
        email
      },
      password: {
        required
      }
    }
}
</script>

<style scoped>
@import '../css/login.css';
</style>