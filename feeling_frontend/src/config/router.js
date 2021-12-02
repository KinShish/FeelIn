import VueRouter from 'vue-router'
const routes = [
	{
		path: '/',
		name: 'index',
		components:{
			default:()=> import('../App'),
		},
		children:[
			{
				path: 'education',
				name: 'education',
				component: () => import('../components/FeelingEducation')
			}
		]
	},
]

const router = new VueRouter({
	routes
})

export default router
