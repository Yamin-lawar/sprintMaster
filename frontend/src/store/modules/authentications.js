import { apolloClient } from '../../main'
import router from '../../router'
import { LOGIN, CURRENT_USER} from '../queries/authQuery'
import Vue from 'vue'

const state = {
    users:{},
    currentUser:{},
    loader: false
}

const getters = {
   users: (state) => state.users,
   currentUser: (state) => state.currentUser,
   loader: (state) => state.loader
}

const actions = {
   
   loginAction({commit}, userData){
       commit('setLoader', true)
       apolloClient.mutate({
         mutation: LOGIN,
         variables: {
            "input":{ 
               "email": userData.email,
               "password": userData.password
            }
         }
      }).then(data => {
          commit('setLoader', false); 
          commit('setCurrentUser', data.data.login.user)
          localStorage.setItem('token',data.data.login.token)
          localStorage.setItem('userId',data.data.login.user._id)
          router.push({ name: "Sprint"}) 
      })
      .catch(err =>{
        const error = JSON.stringify(err)
        commit('setLoader', false); 
        Vue.notify({
            group: 'sprint',
            title: 'Error',
            text: err.graphQLErrors[0].message,
            type: 'error',
            ignoreDuplicates: true,
         })
      })
   },
   getCurrentUser({commit}){
      commit('setLoader', true)
      apolloClient.query({
        query: CURRENT_USER,
        variables: {
            "id": localStorage.getItem('userId'),
        }
     }).then(data => {
         commit('setLoader', false); 
         commit('setCurrentUser', data.data.users)
     })
     .catch(err =>{
       commit('setLoader', false); 
     })
   }
}

const mutations = {
    setUser: (state, users) => (state.users = users),
    setCurrentUser: (state, currentUser) => (state.currentUser = currentUser),
    setLoader: (state, loader) => (state.loader = loader),
  
}

export default {
   state,
   getters,
   actions,
   mutations    
}