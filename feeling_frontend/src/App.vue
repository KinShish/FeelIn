<template lang="pug">
	div
		//.blocLinks
			router-link(to="/education") Обучение
			router-link(to="/education") Одобренные
			router-link(to="/education") Не одобренные
			router-link(to="/education") История изменений
		FeelingIndex
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
<style scoped>
	.logo{
		background: #C4C4C4;
		width: fit-content;
		margin: 5px auto 15px auto;
		padding: 5px 20px;
	}
	.blocLinks{
		display: flex;
		place-content: flex-end;
		margin-bottom: 15px;
	}
	.blocLinks a{
		padding: 20px 50px;
		margin: 0 15px;
		background: grey;
		border-radius: 5px;
	}
</style>
