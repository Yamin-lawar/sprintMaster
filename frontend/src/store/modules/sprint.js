const state = {
    sprints:{},
    sprintLoader: false,
    creationSprintFlag: false
}

const getters = {
   sprints: (state) => state.sprints,
   sprintLoader: (state) => state.sprintLoader,
   creationSprintFlag: (state) => state.creationSprintFlag
}

const actions = {
   addSprint({commit}, sprintData){
       commit('setLoader', true);
       console.log(sprintData,'sprintData')
       fetch('https://jsonplaceholder.cypress.io/todos',{
        method:'post',
        body: JSON.stringify({title: 'sdgf', completed: false}),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getSprint({commit})}) //this.todos = json)
      .catch(err => { throw err; });
   },
   editSprint({commit}, sprintData){
      commit('setLoader', true);
      console.log(sprintData,'sprintData')
      fetch('https://jsonplaceholder.cypress.io/todos',{
       method:'post',
       body: JSON.stringify({title: 'sdgf', completed: false}),
       headers: {
         "Content-type": "application/json; charset=UTF-8"
       }
     })
     .then(response => response.json())
     .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getSprint({commit})}) //this.todos = json)
     .catch(err => { throw err; });
   },
   deleteSprint({commit}, id){
      commit('setLoader', true);
      console.log(id,'sprintData')
      fetch('https://jsonplaceholder.cypress.io/todos',{
       method:'post',
       body: JSON.stringify({title: 'sdgf', completed: false}),
       headers: {
         "Content-type": "application/json; charset=UTF-8"
       }
     })
     .then(response => response.json())
     .then(json =>  {actions.getSprint({commit})}) //this.todos = json)
     .catch(err => { throw err; });
   },
   resetSprintCreationFlag({commit}){
      console.log('setCreationFlag')
      commit('setCreationFlag', false);
   },
   getSprint({commit}){
      console.log('this is get function')
      commit('setLoader', true);
      fetch('https://jsonplaceholder.cypress.io/todos?limit=10')
        .then(response => response.json())
        .then(json => {
                commit('setSprintList', json); 
                commit('setLoader', false);
        })
      .catch(err => { throw err; });
   }
}

const mutations = {
    setLoader: (state, sprintLoader) => (state.sprintLoader = sprintLoader),
    setCreationFlag: (state, creationSprintFlag) => (state.creationSprintFlag = creationSprintFlag),
    setSprintList: (state, sprints) => (state.sprints = sprints),
  
}

export default {
   state,
   getters,
   actions,
   mutations    
}