<template lang="pug">
	div
		//router-link(to="/education") Обучение
		FeelingIndex(v-if="$route.name==='index'")
		transition(name="opacity")
			keep-alive
				router-view
</template>
<script>
	export default {
		components: {
			'FeelingIndex':()=>import('./components/FeelingIndex')
		}
	}
</script>
