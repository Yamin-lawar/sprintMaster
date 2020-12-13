import Vuex from 'vuex';
import Vue from 'vue';
import authentications from './modules/authentications';
import team from './modules/team';
import user from './modules/user';
import project from './modules/project';
import sprint from './modules/sprint'
import {apolloClient} from '../main'
import gql from 'graphql-tag'


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