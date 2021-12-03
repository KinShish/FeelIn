import Vue from 'vue'
import router from './config/router'
import VueRouter from 'vue-router'
import axios from 'axios'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './config/index.css'
Vue.prototype.$server='http://kinshish.ru/api/'
//Vue.prototype.$server='http://192.168.4.23:3000/'
Vue.config.productionTip = false

import VueAxios from 'vue-axios'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueAxios, axios)
Vue.use(VueRouter)
const app = {
	setupVue: function() {
		new Vue({
			name: "app",
			el: "#app",
			router,
			data() {
				return {

				}
			},
		});
	}
}
app.setupVue();
