import store from '../store'
/**
 * To check if current user is not present there then try to get that from token if anything is unauthrised throw user out of system
 * @author Yamin
 * @param to
 * @param from
 * @param next
 */
export default (to, from, next) => {
    const currentUser = JSON.parse(JSON.stringify(store.state.authentications.currentUser))
    if(Object.keys(currentUser).length == 0){
        if(to.name !== "Login" && localStorage.getItem('userId') !== null){
            store.dispatch('getCurrentUser', to.name)
        }else{
            next({
                path: '/'
            })
        }
       
    }else{
        next()
    }

}