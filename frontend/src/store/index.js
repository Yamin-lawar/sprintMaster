import Vuex from 'vuex';
import Vue from 'vue';
import authentications from './modules/authentications';

Vue.use(Vuex);

export default new Vuex.Store({
    modules:{
        authentications
    }
})