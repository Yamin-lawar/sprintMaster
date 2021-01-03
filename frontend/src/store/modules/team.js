import { All_TEAMS, ADD_TEAM, EDIT_TEAM, DELETE_TEAM} from '../queries/teamQuery'
import { apolloClient} from '../../main' 
import {notify} from '../../utils/Helper'
const state = {
    teams:{},
    teamLoader: false,
    creationFlag: false
}


const getters = {
   teams: (state) => state.teams,
   teamLoader: (state) => state.teamLoader,
   creationFlag: (state) => state.creationFlag
}

const actions = {
   addTeam({commit}, teamData){
      commit('setLoader', true);
        console.log(teamData,'teamData')
        apolloClient.mutate({
        mutation: ADD_TEAM,
        variables: {
            "input": teamData
        }
      }) 
      .then(json =>  {
        console.log('success',json)
        commit('setLoader', false); 
        commit('setCreationFlag', true); 
        this.dispatch('getTeam',{commit})
        notify('Team created successfully','Success','success')
      }) //this.todos = json)
      .catch(err => { 
        commit('setLoader', false); 
      }); 
       
   },
   editTeam({commit}, teamData){
      commit('setLoader', true);
        apolloClient.mutate({
        mutation: EDIT_TEAM,
        variables: {
            "input": teamData
        }
      }).then(json =>  {
        commit('setLoader', false); 
        commit('setCreationFlag', true); 
        this.dispatch('getTeam',{commit})
        notify('Team updated successfully','Success','success')
      }) //this.todos = json)
      .catch(err => { 
        commit('setLoader', false); 
      });
      
   },
   deleteTeam({commit}, id){
      commit('setLoader', true);
      apolloClient.mutate({
        mutation: DELETE_TEAM,
        variables: {
            "input": {
              "_id": id
            }
        }
      }).then(json =>  {
        console.log('success',json)
        commit('setLoader', false); 
        this.dispatch('getTeam',{commit})
        notify(json.data.removeTeam.message,'Success','success')
      }).catch(err => { 
        commit('setLoader', false); 
      });
     
   },
   resetCreationFlag({commit}){
      console.log('setCreationFlag')
      commit('setCreationFlag', false);
   },
   getTeam({commit}){
      apolloClient.query({
        query: All_TEAMS,
        fetchPolicy: 'network-only'
      }).then(data => {
        console.log(data,'data')
         commit('setLoader', false); 
         commit('setTeamList', data.data.teams); 
     }).catch(err =>{
       commit('setLoader', false); 
     })
   }
}

const mutations = {
    setLoader: (state, teamLoader) => (state.teamLoader = teamLoader),
    setCreationFlag: (state, creationFlag) => (state.creationFlag = creationFlag),
    setTeamList: (state, teams) => (state.teams = teams),
  
}

export default {
   state,
   getters,
   actions,
   mutations    
}