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
       console.log(projectData,'userData')
       fetch('https://jsonplaceholder.cypress.io/todos',{
        method:'post',
        body: JSON.stringify({title: 'sdgf', completed: false}),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getProject({commit})}) //this.todos = json)
      .catch(err => { throw err; });
   },
   editProject({commit}, projectData){
      commit('setLoader', true);
      console.log(projectData,'projectData')
      fetch('https://jsonplaceholder.cypress.io/todos',{
       method:'post',
       body: JSON.stringify({title: 'sdgf', completed: false}),
       headers: {
         "Content-type": "application/json; charset=UTF-8"
       }
     })
     .then(response => response.json())
     .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getProject({commit})}) //this.todos = json)
     .catch(err => { throw err; });
   },
   deleteProject({commit}, id){
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
     .then(json =>  {actions.getProject({commit})}) //this.todos = json)
     .catch(err => { throw err; });
   },
   resetProjectCreationFlag({commit}){
      console.log('setCreationFlag')
      commit('setCreationFlag', false);
   },
   getProject({commit}){
      console.log('this is get function')
      commit('setLoader', true);
      fetch('https://jsonplaceholder.cypress.io/todos?limit=10')
        .then(response => response.json())
        .then(json => {
                commit('setProjectList', json); 
                commit('setLoader', false);
        })
      .catch(err => { throw err; });
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