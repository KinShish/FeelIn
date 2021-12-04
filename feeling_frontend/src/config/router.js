import VueRouter from 'vue-router'
const routes = [
	{
		path: '/',
		name: 'index',
		components:{
			default:()=> import('../App'),
		},
	},
]

const router = new VueRouter({
	routes
})

export default router
