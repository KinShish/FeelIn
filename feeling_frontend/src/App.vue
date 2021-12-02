<template lang="pug">
	div
		.blocLinks
			router-link(to="/education") Обучение
			router-link(to="/education") Одобренные
			router-link(to="/education") Не одобренные
			router-link(to="/education") История изменений
		transition(name="opacity")
			keep-alive
				router-view
</template>

<style scoped>
	.blocLinks{
		display: flex;
		place-content: flex-end;
	}
	.blocLinks a{
		padding: 20px 50px;
		margin: 0 15px;
		background: grey;
		border-radius: 5px;
	}
</style>
