import Vue from 'vue'
import Vuex from 'vuex'
import { db } from "../src/firebase";
import { auth } from "../src/firebase";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex); 

let state = {
    user: {
        id: "",
        email: ""
    },
    isSignedIn: false
}

const Store = new Vuex.Store({
    plugins: [createPersistedState({ storage: window.localStorage })],
    state: state,
    getters: {
        getUser(state) {
            return state.user;
        },
        getIsSignedIn(state) {
            return state.isSignedIn; 
        }
    },
    mutations: {
        login_success(state, user) {
            state.isSignedIn = true;
            state.user = {
                id: user.id,
                email: user.email
            };
        },        
        login_failed(state) {
            state.isSignedIn = false;
            state.user = null;
        },
        logout(state) {
            state.isSignedIn = false;
            state.user = null;
        }              
    },
    actions: {
        async login({ commit }, loginDetails) {
            try {
                await auth.signInWithEmailAndPassword(loginDetails.email, loginDetails.password);
            } catch (error) {
                console.log(error.message)
            }
            
            return new Promise(resolve => {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        let ref = db.collection("users").doc(user.uid); 
                        let doc = await ref.get(); 
                        let userData = doc.data()

                        let userState = { 
                            id: user.uid,
                            email: user.email
                        };
                        // Backwards compatability 
                        if (!userData) {
                            await ref.set({
                                id: userState.id,
                                email: userState.email,
                            });
                        }

                        commit("login_success", userState);
                    } else {
                        commit("login_failed");
                    }
                    resolve();
                });
            })
        },
        async register({ commit }, registrationDetails) {
            try {
                await auth.createUserWithEmailAndPassword(registrationDetails.email, registrationDetails.password); 
            } catch (error) {
                console.log(error.message)
            }            
            
            return new Promise(resolve => {
                auth.onAuthStateChanged(async (user) => {
                    if (user) {
                        let ref = db.collection("users").doc(user.uid); 

                        let userState = { 
                            id: user.uid,
                            email: user.email
                        };

                        await ref.set({
                            id: userState.id,
                            email: userState.email,
                        });
                        commit("login_success", userState);
                    } else {
                        commit("login_failed");
                    }
                    resolve();
                });     
            })          
        },
        async logout({ commit }) {
            return new Promise(resolve => {
                auth.signOut().then(() => {
                    commit("logout");
                    resolve()
                }).catch((error) => {
                    console.log(error);
                    resolve()
                });
            });
        },        
    }
});

export default Store; 