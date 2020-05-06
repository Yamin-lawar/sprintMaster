const state = {
    users:{},
    loader: false
}

const getters = {
   users: (state) => state.users,
   loader: (state) => state.loader
}

const actions = {
   loginAction({commit}, userData){
       console.log(userData,'userData')
       commit('setLoader', true)
       fetch('https://jsonplaceholder.cypress.io/todos?limit=10')
       .then(response => response.json())
       .then(json => {
               commit('setUser', json); 
               setTimeout( function () { commit('setLoader', false) }, 5000) 
       })
       .catch(err => { throw err; });
   }
}

const mutations = {
    setUser: (state, users) => (state.users = users),
   setLoader: (state, loader) => (state.loader = loader),
  
}

export default {
   state,
   getters,
   actions,
   mutations    
}