<template lang="pug">
	div
		.totalCount
			p.blocCount Осталось фотографий: 1000
		.mainBlockEducation.row
			.photoBlock.col-6
				img(src="https://alna.ru/thumbs/650/up/immovables_img/248933/1638462011218.jpg")
			.buttonsBlock.col-5
				b-input-group
					//b-form-input(aria-describedby="basic-addon1")
					multiselect(v-model="valueSelect"
						:options="optionsSelect"
						:searchable="true"
						:multiple="false"
						label="text",
						track-by="text",
						:close-on-select="true"
						:show-labels="false"
						placeholder="Выберите человека")
				b-button.col-12.btnAddNew(@click="$refs.modalAddForSelector.show()") Добавить нового человека
				.col-12.buttonsBlockType
					b-button.col-5(variant="danger" @click="$_feeling_education_ban") Заблокировать
					b-button.col-5(variant="success" @click="$_feeling_education_approve") Одобрить
		.arrowNavigation
			b-button(@click="$_feeling_education_prev") Предыдущий
			b-button(@click="$_feeling_education_next") Следующий
		b-modal(hide-footer ref="modalAddForSelector" centered)
			template(slot="modal-header")
				h4 Добавить нового человека
			.modalBody
				b-form(@submit.stop.prevent="$_feeling_edication_addNewName")
					b-form-group
						b-form-input
					b-button.col-12(variant="success" type="submit") Добавить
					b-button.col-12(type="button" variant="danger" @click="$refs.modalAddForSelector.hide()") Отмена
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
	data(){
		return{
			optionsSelect: [
				{text:'привет',value:1},
				{text:'Дима',value:2},
				{text:'ого',value:3},
			],
			valueSelect:'',
		}
	},
	methods:{
		$_feeling_education_approve(){
			console.log('одобрить')
		},
		$_feeling_education_ban(){
			console.log('заблокировать')
		},
		$_feeling_education_prev(){
			console.log('предыдущий')
		},
		$_feeling_education_next(){
			console.log('следующий')
		},
		$_feeling_edication_addNewName(){
			console.log('asd')
		}
	},
	created() {
		/*this.axios
			.get('')
			.then(res=>{
				console.log(res)
			})*/
	},
	components: {
		Multiselect
	}
}
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style scoped>
	.photoBlock{
		position: relative;
	}
	.photoBlock img{
		width: 100%;
	}
	.buttonsBlock{
		place-content: flex-end;
	}
	.modalBody input{
		margin-bottom: 15px;
	}
	.modalBody button{
		margin-bottom: 15px;
	}
	.buttonsBlockType{
		margin-top: 15px;
	}
	.buttonsBlockType button:last-child{
		float: right;
	}
	.blocCount{
		font-size: 20px;
		font-weight: bolder;
		margin-left: 15px;
	}
	.mainBlockEducation{
		margin: 0;
	}
	.arrowNavigation{
		position: fixed;
		bottom: 100px;
		width: 100%;
		padding: 0 15px;
	}
	.arrowNavigation button{
		height: 150px;
		width: 200px;
	}
	.arrowNavigation button:last-child{
		float: right;
	}
	.btnAddNew{
		margin-top: 15px;
		width: 100%;
	}
</style>
