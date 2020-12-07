
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
       fetch('https://jsonplaceholder.cypress.io/todos',{
        method:'post',
        body: JSON.stringify({title: 'sdgf', completed: false}),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
      .then(response => response.json())
      .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getUser({commit})}) //this.todos = json)
      .catch(err => { throw err; });
   },
   editUser({commit}, userData){
      commit('setLoader', true);
      console.log(userData,'userData')
      fetch('https://jsonplaceholder.cypress.io/todos',{
       method:'post',
       body: JSON.stringify({title: 'sdgf', completed: false}),
       headers: {
         "Content-type": "application/json; charset=UTF-8"
       }
     })
     .then(response => response.json())
     .then(json =>  {commit('setLoader', false); commit('setCreationFlag', true); actions.getUser({commit})}) //this.todos = json)
     .catch(err => { throw err; });
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
      console.log('setCreationFlag')
      commit('setCreationFlag', false);
   },
   getUser({commit}){
      console.log('this is get function')
      commit('setLoader', true);
      fetch('https://jsonplaceholder.cypress.io/todos?limit=10')
        .then(response => response.json())
        .then(json => {
                commit('setUserList', json); 
                commit('setLoader', false);
        })
      .catch(err => { throw err; });
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