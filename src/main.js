// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import vant from 'vant'
import axios from 'axios'; 
Vue.prototype.$http = axios;
import 'vant/lib/index.css'

import date from '@/utils/date';

Vue.config.productionTip = false
Vue.use(vant)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
