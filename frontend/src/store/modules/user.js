import { All_USERS, ADD_USER, EDIT_USER } from '../queries/userQuery'
import { apolloClient} from '../../main'
import {notify} from '../../utils/Helper'

const state = {
    allUsers:{},
    userLoader: false,
    creationUserFlag: false
}

const getters = {
   allUsers: (state) => state.allUsers,
   userLoader: (state) => state.userLoader,
   creationUserFlag: (state) => state.creationUserFlag
}

const actions = {
      addUser({commit}, userData){
       commit('setLoader', true);
       console.log(userData,'userData')
       apolloClient.mutate({
        mutation: ADD_USER,
        variables: {
           "input": userData
        }
      }) 
      .then(json =>  {
        console.log('success',json)
        commit('setLoader', false); 
        commit('setCreationFlag', true); 
        this.dispatch('getUser',{commit})
        notify('User created successfully','Success','success')
      }) //this.todos = json)
      .catch(err => { 
        commit('setLoader', false); 
      });
   },
   editUser({commit}, userData){
      commit('setLoader', true);
      console.log(userData,'userData')
      apolloClient.mutate({
       mutation: EDIT_USER,
       variables: {
          "input": userData
       }
     }) 
     .then(json =>  {
       console.log('success',json)
       commit('setLoader', false); 
       commit('setCreationFlag', true); 
       this.dispatch('getUser',{commit})
       notify('User updated successfully','Success','success')
     }) //this.todos = json)
     .catch(err => { 
       commit('setLoader', false); 
     });
   },
   deleteUser({commit}, id){
      commit('setLoader', true);
      console.log(id,'teamData')
      fetch('https://jsonplaceholder.cypress.io/todos',{
       method:'post',
       body: JSON.stringify({title: 'sdgf', completed: false}),
       headers: {
         "Content-type": "application/json; charset=UTF-8"
       }
     })
     .then(response => response.json())
     .then(json =>  {actions.getUser({commit})}) //this.todos = json)
     .catch(err => { throw err; });
   },
   resetUserCreationFlag({commit}){
      commit('setCreationFlag', false);
   },
   getUser({commit}){
      console.log('get all users')
      commit('setLoader', true);
      apolloClient.query({
        query: All_USERS,
        fetchPolicy: 'network-only'
      }).then(data => {
        console.log(data,'data')
         commit('setLoader', false); 
         commit('setUserList', data.data.users); 
     }).catch(err =>{
       commit('setLoader', false); 
     })
      
   }
   
}

const mutations = {
    setLoader: (state, userLoader) => (state.userLoader = userLoader),
    setCreationFlag: (state, creationUserFlag) => (state.creationUserFlag = creationUserFlag),
    setUserList: (state, allUsers) => (state.allUsers = allUsers),
  
}

export default {
   state,
   getters,
   actions,
   mutations    
}