import { All_SPRINT, ADD_SPRINT, EDIT_SPRINT, DELETE_SPRINT, ACTIVE_SPRINT} from '../queries/sprintQuery'
import { apolloClient} from '../../main' 
import {notify} from '../../utils/Helper'
const state = {
    sprints:{},
    activeSprint:{},
    sprintLoader: false,
    creationSprintFlag: false
}

const getters = {
   sprints: (state) => state.sprints,
   activeSprint: (state) => state.activeSprint,
   sprintLoader: (state) => state.sprintLoader,
   creationSprintFlag: (state) => state.creationSprintFlag
}

const actions = {
   addSprint({commit}, sprintData){
      commit('setLoader', true);
        apolloClient.mutate({
        mutation: ADD_SPRINT,
        variables: {
            "input": sprintData
        }
      }) 
      .then(json =>  {
        console.log('success',json)
        commit('setLoader', false); 
        commit('setCreationFlag', true); 
        this.dispatch('getSprint',{commit})
        notify(json.data.createSprint.message,'Success','success')
      }) //this.todos = json)
      .catch(err => { 
        commit('setLoader', false); 
      }); 
   },
   editSprint({commit}, sprintData){
     commit('setLoader', true);
        apolloClient.mutate({
        mutation: EDIT_SPRINT,
        variables: {
            "input": sprintData
        }
      }).then(json =>  {
        console.log(json,'edit sptiny')
        commit('setLoader', false); 
        commit('setCreationFlag', true); 
        this.dispatch('getSprint',{commit})
        notify(json.data.updateSprint.message,'Success','success')
      }) //this.todos = json)
      .catch(err => { 
        commit('setLoader', false); 
      });
   },
   deleteSprint({commit}, id){
     commit('setLoader', true);
      apolloClient.mutate({
        mutation: DELETE_SPRINT,
        variables: {
            "input": {
              "_id": id
            }
        }
      }).then(json =>  {
        console.log('success',json)
        commit('setLoader', false); 
        this.dispatch('getSprint',{commit})
        notify(json.data.removeSprint.message,'Success','success')
      }).catch(err => { 
        commit('setLoader', false); 
      });
   },
   resetSprintCreationFlag({commit}){
      console.log('setCreationFlag')
      commit('setCreationFlag', false);
   },
   getSprint({commit}){
     commit('setLoader', true);
      apolloClient.query({
        query: All_SPRINT,
        fetchPolicy: 'network-only'
      }).then(data => {
        console.log(data,'data')
         commit('setLoader', false); 
         commit('setSprintList', data.data.sprints); 
     }).catch(err =>{
       commit('setLoader', false); 
     })
   },
   getActiveSprint({commit}){
     commit('setLoader', true);
      apolloClient.query({
        query: ACTIVE_SPRINT,
        fetchPolicy: 'network-only'
      }).then(data => {
       
        commit('setLoader', false); 
        commit('setActiveSprint', data.data.activeSprint); 
      }).catch(err =>{
        commit('setLoader', false); 
      })
   }
}

const mutations = {
    setLoader: (state, sprintLoader) => (state.sprintLoader = sprintLoader),
    setCreationFlag: (state, creationSprintFlag) => (state.creationSprintFlag = creationSprintFlag),
    setSprintList: (state, sprints) => (state.sprints = sprints),
    setActiveSprint: (state, activeSprint) => (state.activeSprint = activeSprint)
  
}

export default {
   state,
   getters,
   actions,
   mutations    
}