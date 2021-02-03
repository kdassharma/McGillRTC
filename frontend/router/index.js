import Vue from 'vue'
import Router from 'vue-router'
// import store from '../src/store/index'

import Home from '../src/pages/Home.vue'
import VideoChat from '../src/pages/VideoChat.vue'
import ErrorPage from '../src/pages/ErrorPage.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/chat',
            name: 'VideoChat',
            component: VideoChat,
        },
        {
            path: '/error',
            name: 'ErrorPage',
            component: ErrorPage,
        }
    ]
});

export default router;