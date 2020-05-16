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
       fetch('https://jsonplaceholder.cypress.io/todos',{
        method:'post',
        body: JSON.stringify({title: 'sdgf', completed: false}),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getTeam({commit})}) //this.todos = json)
      .catch(err => { throw err; });
   },
   editTeam({commit}, teamData){
      commit('setLoader', true);
      console.log(teamData,'teamData')
      fetch('https://jsonplaceholder.cypress.io/todos',{
       method:'post',
       body: JSON.stringify({title: 'sdgf', completed: false}),
       headers: {
         "Content-type": "application/json; charset=UTF-8"
       }
     })
     .then(response => response.json())
     .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getTeam({commit})}) //this.todos = json)
     .catch(err => { throw err; });
   },
   deleteTeam({commit}, id){
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
     .then(json =>  {actions.getTeam({commit})}) //this.todos = json)
     .catch(err => { throw err; });
   },
   resetCreationFlag({commit}){
      console.log('setCreationFlag')
      commit('setCreationFlag', false);
   },
   getTeam({commit}){
      console.log('this is get function')
      commit('setLoader', true);
      fetch('https://jsonplaceholder.cypress.io/todos?limit=10')
        .then(response => response.json())
        .then(json => {
                commit('setTeamList', json); 
                commit('setLoader', false);
        })
      .catch(err => { throw err; });
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