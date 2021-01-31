import Vue from 'vue'
import Router from 'vue-router'
// import store from '../src/store/index'

import Home from '../src/pages/Home.vue'


Vue.use(Router)

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        // {
        //     path: '/authenticate',
        //     name: 'Authenticate',
        //     component: Authenticate,
        // }
    ]
});

export default router;