import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex); 

const Store = new Vuex.Store({
    plugins: [createPersistedState({ storage: window.localStorage })],
    state: {
    },
    getters: {
    },
    mutations: {
    },
    actions: {
    }
});

export default Store; 