import Vuex from 'vuex';
import Vue from 'vue';
import authentications from './modules/authentications';
import team from './modules/team';
import user from './modules/user';
import project from './modules/project';
import sprint from './modules/sprint'


Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        authentications,
        team,
        user,
        project,
        sprint
    }
})