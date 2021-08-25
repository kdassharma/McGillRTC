import App from './App.vue'
import Vue from 'vue'
import router from '../router'
import store from '../store'

import './main.scss'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  el: "#app",
  router: router,
  store: store, 
  render: h => h(App),
}).$mount('#app')
