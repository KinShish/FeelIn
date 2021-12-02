<template lang="pug">
	div
		router-link(to="/education") education1
		transition(name="opacity")
			keep-alive
				router-view
</template>

<style>

</style>
