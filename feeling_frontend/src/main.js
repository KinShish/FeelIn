import Vue from 'vue'
import router from './config/router'
import VueRouter from 'vue-router'

Vue.config.productionTip = false


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
