import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import store from './store'
import VueGoodTablePlugin from 'vue-good-table';
import VModal from 'vue-js-modal'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import Notifications from 'vue-notification'
import VueConfirmDialog from 'vue-confirm-dialog'
import VueApexCharts from 'vue-apexcharts'



export const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'http://localhost:4002/graphql',
  fetchOptions:{
    credentials: 'include'
  },
  request: operation => {
     if(localStorage.token){
      operation.setContext({
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
     }else{
       localStorage.setItem('token','')
     }
     
  },
  onError: ({graphQLErrors, networkError}) => {
    if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>{
        Vue.notify({
          group: 'sprint',
          title: 'Error',
          text: message,
          type: 'error',
          ignoreDuplicates: true,
        })
        if(message == "Unauthorised"){
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          router.push({ name: "Login"}) 
        }
    });
  if (networkError) console.log(`[Network error]: ${networkError}`);
  }
})


Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuelidate)
Vue.use(VueGoodTablePlugin);
Vue.use(VModal)
Vue.use(VueApollo)
Vue.use(Notifications)
Vue.use(VueConfirmDialog)
Vue.use(VueApexCharts)

Vue.component('vue-confirm-dialog', VueConfirmDialog.default)
Vue.component('apexchart', VueApexCharts)


const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})


Vue.config.productionTip = false

export const root = new Vue({
  store,
  router,
  apolloProvider,
  render: h => h(App),
  created(){
    //if not login page then call current user api to get current user detail on every refresh i.e when app will be created
    if(this.$route.name !== "Login" && localStorage.getItem('userId') !== null){
      this.$store.dispatch('getCurrentUser')
    }
    
  }
}).$mount('#app')
