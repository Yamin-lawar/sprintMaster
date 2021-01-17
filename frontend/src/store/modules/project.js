import { All_PROJECTS, ADD_PROJECT, EDIT_PROJECT, DELETE_PROJECT} from '../queries/projectQuery'
import { apolloClient} from '../../main' 
import {notify} from '../../utils/Helper'
const state = {
    projects:{},
    projectLoader: false,
    creationProjectFlag: false
}

const getters = {
   projects: (state) => state.projects,
   projectLoader: (state) => state.projectLoader,
   creationProjectFlag: (state) => state.creationProjectFlag
}

const actions = {
  
   addProject({commit}, projectData){
        commit('setLoader', true);
        apolloClient.mutate({
        mutation: ADD_PROJECT,
        variables: {
            "input": projectData
        }
      }) 
      .then(json =>  {
        console.log('success',json)
        commit('setLoader', false); 
        commit('setCreationFlag', true); 
        this.dispatch('getProject',{commit})
        notify('Project created successfully','Success','success')
      }) //this.todos = json)
      .catch(err => { 
        commit('setLoader', false); 
      }); 
      
   },
   editProject({commit}, projectData){
      commit('setLoader', true);
        apolloClient.mutate({
        mutation: EDIT_PROJECT,
        variables: {
            "input": projectData
        }
      }).then(json =>  {
        console.log(json,'edit sptiny')
        commit('setLoader', false); 
        commit('setCreationFlag', true); 
        this.dispatch('getProject',{commit})
        notify('Project updated successfully','Success','success')
      }) //this.todos = json)
      .catch(err => { 
        commit('setLoader', false); 
      });
     
   },
   deleteProject({commit}, id){
      console.log('here1')
      commit('setLoader', true);
      apolloClient.mutate({
        mutation: DELETE_PROJECT,
        variables: {
            "input": {
              "_id": id
            }
        }
      }).then(json =>  {
        console.log('here2',json)
        console.log('success',json)
        commit('setLoader', false); 
        this.dispatch('getProject',{commit})
        notify(json.data.removeProject.message,'Success','success')
      }).catch(err => { 
        commit('setLoader', false); 
      });
   },
   resetProjectCreationFlag({commit}){
      console.log('setCreationFlag')
      commit('setCreationFlag', false);
   },
   getProject({commit}){
     
      apolloClient.query({
        query: All_PROJECTS,
        fetchPolicy: 'network-only'
      }).then(data => {
        console.log(data,'data')
         commit('setLoader', false); 
         commit('setProjectList', data.data.projects); 
     }).catch(err =>{
       commit('setLoader', false); 
     })
   }
}

const mutations = {
    setLoader: (state, projectLoader) => (state.projectLoader = projectLoader),
    setCreationFlag: (state, creationProjectFlag) => (state.creationProjectFlag = creationProjectFlag),
    setProjectList: (state, projects) => (state.projects = projects),
  
}

export default {
   state,
   getters,
   actions,
   mutations    
}