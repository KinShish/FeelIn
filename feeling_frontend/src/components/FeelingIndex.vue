<template lang="pug">
	div
		.headerBlock(@click="$_feeling_index_getVideo('61a9b3dc047e1f522c17f570')")
			img(src="../assets/logo.svg")
			h1 Сервис для конвертирования видео в текст.
		.blockHistory
			.greyButtonBlock(@click="openUpload=false" v-if="openUpload&&arrayFiles.length") История загрузок
		transition(mode="out-in" name="opacity")
			.blockUpload(v-if="openUpload" key="1")
				label(for="uploadFile")
					.iconUpload
						img(src="../assets/upload.svg")
					b-progress(:value="progress" :max="100" show-progress animated)
					.additionalSpiner(v-if="openUpload===true&&progress===100")
						b-spinner
						.text Идет получение данных
				b-form-file.d-none(id="uploadFile" v-model="files" @input="$_feeling_index_upload" multiple  accept=".mp4")
			.blockFinishedFiles(v-else key="2")
				h2 Список обработанных файлов:
				.mainBlockFiles
					.blockFileUploaded(v-for="file in arrayFiles")
						.greyBlockTitle {{file.names}}
							img(src="../assets/check.svg" v-if="file.ready")
							.blockSpiner(v-else)
								b-spinner
						.greyBlockBody
							.title Распознаный текст
							.greyButtonBlock(@click="$_feeling_index_look(file)" v-if="file.text") Просмотреть
							.greyButtonBlock(@click="$_feeling_index_exportJson(file)") Выгрузить json
							.dateBlock(v-if="file.ready") Дата преобразования: {{new Date(file.dateCreate).toLocaleDateString()+' в '+new Date(file.dateCreate).toLocaleTimeString()}}
							.dateBlock(v-if="file.audio===0") Идет считывание аудио дорожки...
							.dateBlock(v-if="!file.ready&&file.audio===1") Идет преобразование аудио в текст...
				.blockDoMore
					.greyButtonBlock(@click="openUpload=true")
						span Загрузить еще
						img(src="../assets/triangle.svg")
		b-modal(ref="openFileModal" :title="selectedFile.name" size="lg" hide-footer)
			.textFile {{selectedFile.text}}
</template>

<script>
export default {
	data(){
		return{
			files:[],
			progress:0,
			arrayFiles:[],
			selectedFile:{
				name:'',
				text:''
			},
			arrInterval:[],
			openUpload:true
		}
	},
	methods:{
		$_feeling_index_look(file){
			this.selectedFile.name=file.name
			this.selectedFile.text=file.text
			this.$refs.openFileModal.show();
		},
		$_feeling_index_upload(file){
			let config = {
				onUploadProgress: (progressEvent)=> {
					let count = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
					this.$nextTick(()=>{
						this.progress=count
					})
				}
			};
			if(this.files.length){
				let data = new FormData();
				file.forEach(file=>{
					data.append('file', file)
				})
				this.axios
					.post(this.$server+'task/'+this.files.length, data,config)
					.then(res=>{
						this.$_feeling_index_getVideo(res.data.id)
					})
				this.files=[]
			}
		},
		$_feeling_index_getVideo(id){
			this.axios
				.get(this.$server+'task/'+id)
				.then(res=>{
					for(let index in res.data.data.array_name){
						this.arrayFiles.push({
							name:res.data.data.array_name[index],
							names:res.data.data.names[index],
							dateCreate:res.data.data.create,
							dateReady:res.data.data.dateReady,
							ready:res.data.data.ready,
							id:res.data.data._id,
							text:'',
							audio:0
						})
						this.$_feeling_index_check(res.data.data.array_name[index])
					}
					this.openUpload=false

				})
		},
		async $_feeling_index_check(name){
			if(!await this.$_feeling_index_checkProgress(name)){
				setTimeout(()=>{
					this.$_feeling_index_check(name);
				},5000)
			}
		},
		async $_feeling_index_checkProgress(name){
			const res= await this.axios.get(this.$server+'video/'+name)
			for(let file of this.arrayFiles){
				if(file.name===res.data.data.name){
					file.ready=res.data.data.ready
					file.audio=res.data.data.audio
					localStorage.setItem('savedArrFiles',JSON.stringify(this.arrayFiles))
					if(file.ready){
						file.text=res.data.data.text
						return true
					}
				}
			}
			return false
		},
		$_feeling_index_exportJson(file){
			const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(
				{
					name:file.names,
					text:file.text
				}
			));
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href",dataStr);
			downloadAnchorNode.setAttribute("download", 'test' + ".json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	},
	created() {
		if(localStorage.getItem('savedArrFiles')){
			this.arrayFiles=JSON.parse(localStorage.getItem('savedArrFiles'))
			this.arrayFiles.forEach(item=>{
				if(!item.ready){
					this.$_feeling_index_check(item.name)
				}
			})
		}
	},
	watch:{
		'openUpload'(){
			this.progress=0;
		}
	}
}
</script>

<style scoped>
	.headerBlock{
		text-align: center;
		margin-bottom: 100px;
	}
	.headerBlock h1{
		font-size: 16px;
	}
	.blockUpload{
		background: linear-gradient(180deg, rgba(196, 196, 196, 0.81) 0%, rgba(196, 196, 196, 0.354375) 42.71%, rgba(196, 196, 196, 0.335045) 99.99%, rgba(196, 196, 196, 0) 100%);
		border-radius: 10px;
		width: 80%;
		margin: 0 auto;
		display: grid;
		place-content: center;
		height: 260px;
		position: relative;
	}
	.iconUpload{
		background: #017D89;
		border-radius: 9px;
		width: 250px;
		height: 60px;
		display: grid;
		place-content: center;
		cursor: pointer;
	}
	.blockHistory{
		width: 80%;
		margin: 0 auto 30px auto;
		display: flex;
		place-content: flex-end;
		height: 60px;
	}
	.blockDoMore{
		width: 80%;
		margin: 30px auto 30px auto;
		display: flex;
		place-content: center;
	}
	.greyButtonBlock{
		background: #017D89;
		border-radius: 10px;
		width: 200px;
		height: 60px;
		display: flex;
		place-content: center;
		color: white;
		line-height: 60px;
		cursor: pointer;
	}
	.greyButtonBlock img{
		height: 20px;
		margin: 22px 0 0 8px;
	}
	.blockFinishedFiles{
		margin-top: 30px;
	}
	.blockFinishedFiles h2{
		font-size: 24px;
		text-align: center;
		margin-bottom: 15px;
	}
	.mainBlockFiles{
		display: flex;
		width: 80%;
		margin: 0 auto;
		flex-wrap: wrap;
		place-content: center;
	}
	.blockFileUploaded{
		flex: auto;
		max-width: 220px;
		text-align: center;
		margin: 0 15px 15px 15px;
	}
	.greyBlockTitle{
		background: #C4C4C4;
		border-radius: 10px;
		padding: 5px 0;
		font-size: 18px;
		position: relative;
	}
	.greyBlockTitle img{
		margin-bottom: 10px;
		position: absolute;
		top: -7px;
		right: 0;
	}
	.greyBlockBody{
		margin-top: 15px;
		background: #C4C4C4;
		border-radius: 10px;
		display: grid;
		place-content: center;
	}
	.title{
		font-size: 15px;
		border-bottom: 2px solid;
		padding-bottom: 5px;
	}
	.greyBlockBody .greyButtonBlock{
		margin: 15px 0;
		font-size: 18px;
	}
	.greyBlockBody .greyButtonBlock:last-child{
		margin-top: 0;
	}
	.blockSpiner{
		position: absolute;
		top: 0;
		right: 0;
	}
	.close{
		background: none;
		border: none;
		font-size: 30px;
	}
	.opacity-enter-active {
		opacity: 1;
		transition: all .2s ease;
	}
	.opacity-enter, .opacity-leave-to {
		opacity: 0;
		transition: all .2s ease;
	}
	.dateBlock{
		width: 200px;
	}
	.additionalSpiner{
		position: absolute;
		width: 100%;
		left: 0;
		display: grid;
		place-content: center;
	}
	.additionalSpiner .spinner-border{
		margin: 0 auto;
	}
</style>