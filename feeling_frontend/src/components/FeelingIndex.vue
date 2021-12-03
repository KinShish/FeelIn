<template lang="pug">
	div
		.headerBlock
			img(src="../assets/logo.svg")
			h1 Сервис для конвертирования видео в текст.
		.blockHistory(:class="{'back':!openUpload}")
			.greyButtonBlock(@click="openUpload=false" v-if="openUpload&&arrayFiles.length") История загрузок
			.greyButtonBlock(@click="openUpload=true" v-if="!openUpload") Назад
		transition(mode="out-in" name="opacity")
			.blockUpload(v-if="openUpload" key="1")
				label(for="uploadFile")
					.iconUpload
						img(src="../assets/upload.svg")
					b-progress(:value="progress" :max="100" show-progress animated)
				b-form-file.d-none(id="uploadFile" v-model="files" @input="$_feeling_index_upload" multiple  accept="video/mp4,video/x-m4v,video/*,.flv,.mkv")
			.blockFinishedFiles(v-else key="2")
				h2 Список обработанных файлов:
				.mainBlockFiles
					.blockFileUploaded(v-for="file in arrayFiles")
						.greyBlockTitle
							span {{file.names}}
							img(src="../assets/check.svg" v-if="file.ready")
							.blockSpiner(v-else)
								b-spinner
						.greyBlockBody
							.title(v-if="file.text!==null") Распознаный текст
							.greyButtonBlock(@click="$_feeling_index_look(file)" v-if="file.text!==null") Просмотреть
							.greyButtonBlock(@click="$_feeling_index_exportJson(file)" v-if="file.text!==null") Выгрузить json
							span(v-if="file.ready")
								.dateBlock Дата преобразования: {{new Date(file.dateCreate).toLocaleDateString()+' в '+new Date(file.dateCreate).toLocaleTimeString()}}
								.dateBlock
									span(v-if="file.time") Время преобразования: {{file.time}} минут
							.dateBlock(v-if="file.audio===0") Идет считывание аудио дорожки...
							.dateBlock(v-if="!file.ready&&file.audio===1") Идет преобразование аудио в текст...
				.blockDoMore
					.greyButtonBlock(@click="openUpload=true")
						span Загрузить еще
						img(src="../assets/triangle.svg")
		transition(name="modalWatch" mode="out-in")
			.myModalBlock(v-if="openModal")
				.backGroundBlock(@click="openModal=false")
				.myModal
					.titleModal {{selectedFile.names}}
						.closeModal(@click="openModal=false")
							b-icon(icon="x")
						.infoFile Дата преобразования: {{new Date(selectedFile.dateCreate).toLocaleDateString()+' в '+new Date(selectedFile.dateCreate).toLocaleTimeString()}}
						.infoFile Время преобразования: {{$_feeling_index_getTime(1000)}} минут
					.blockTabs
						b-tabs(v-model="tabActive")
							b-tab(title="Распознаный текст")
								.bodyModal
									.contentBody
										p {{selectedFile.text}}
							b-tab(title="Очищенный текст")
								.bodyModal
									.contentBody
										p {{selectedFile.normalize}}
							b-tab(title="Текст с временными рамками")
								.bodyModal
									.contentBody
										span(v-for="time of selectedFile.chunks")
											.timeBlock(v-if="time.chunk.text")
												.time {{$_feeling_index_getTime(time.chunk.time)}}
												.text {{time.chunk.text}}
							//b-tab(title="Спикеры")
								.bodyModal
									.contentBody
										.row
											.col-6.speekerBlock
												.col-12.row
													.col-6
														.blockImg
															img(src="../assets/2.jpeg")
													.col-6
														.name Дмитрий Снесарь
											.col-6.speekerBlock
												.col-12.row
													.col-6
														.blockImg
															img(src="../assets/1.jpeg")
													.col-6
														.name Кирилл Токарев
					.footerModal
						.greyButtonBlock(@click="$_feeling_index_exportJson(selectedFile)") Выгрузить json
</template>

<script>
export default {
	data(){
		return{
			tabActive:0,
			openModal:false,
			files:[],
			progress:0,
			arrayFiles:[],
			selectedFile:{},
			arrInterval:[],
			openUpload:true,
			version:'1'
		}
	},
	methods:{
		$_feeling_index_getTime(time){
			return (time % 60 > 9) ? Math.floor(time / 60) + ':' + Math.floor(time % 60) : Math.floor(time / 60) + ':' + '0' + time % 60
		},
		$_feeling_index_look(file){
			let arr=[]
			arr=file.chunks.map(item=>{
				return{
					chunk:{
						time:Math.floor(item.result!==undefined?item.result[0].start:0),
						text:item.text
					}
				}
			})
			file.chunks=arr
			this.selectedFile=file
			this.openModal=true
		},
		async $_feeling_index_upload(file){
			let config = {
				onUploadProgress: (progressEvent)=> {
					let count = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
					this.$nextTick(()=>{
						if(this.progress<=90){
							this.progress=count
						}
					})
				}
			};
			if(this.files.length){
				let data = new FormData();
				file.forEach(file=>{
					data.append('file', file)
				})
				try {
					const res=await this.axios.post(this.$server+'task/'+this.files.length, data,config)
					if(!res.data.err){
						this.progress=100;
						this.$_feeling_index_getVideo(res.data.id)
						this.files=[]
					}else{
						this.progress=0;
					}
				} catch (error) {
					this.progress=0;
				}
			}
		},
		async $_feeling_index_getVideo(id){
			const res=await this.axios.get(this.$server+'task/'+id)
			if(!res.data.err){
				for(let index in res.data.data.array_name){
					this.arrayFiles.push({
						name:res.data.data.array_name[index],
						names:res.data.data.names[index],
						dateCreate:res.data.data.create,
						dateReady:res.data.data.dateReady,
						ready:res.data.data.ready,
						id:res.data.data._id,
						text:null,
						chunks:'',
						normalize:'',
						audio:0
					})
					this.$_feeling_index_check(res.data.data.array_name[index])
				}
				this.openUpload=false
			}
		},
		async $_feeling_index_check(name){
			if(!await this.$_feeling_index_checkProgress(name)){
				setTimeout(()=>{
					this.$_feeling_index_check(name);
				},5000)
			}
		},
		async $_feeling_index_checkProgress(name){
			const res = await this.axios.get(this.$server+'video/'+name)
			if(!res.data.err){
				for(let file of this.arrayFiles){
					if(file.name===res.data.data.name){
						file.ready=res.data.data.ready
						file.audio=res.data.data.audio
						localStorage.setItem('savedArrFiles',JSON.stringify(this.arrayFiles))
						if(file.ready){
							file.text=res.data.data.text
							file.time=this.$_feeling_index_getTime(res.data.data.time/1000)
							file.chunks=res.data.data.chunks
							file.normalize=res.data.data.normalize
							return true
						}
					}
				}
				return false
			}
		},
		$_feeling_index_exportJson(file){
			let myJson={}
			myJson={
				name:file.names,
				text:file.text,
				chunks:file.chunks
			}
			const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(myJson));
			const downloadAnchorNode = document.createElement('a');
			downloadAnchorNode.setAttribute("href",dataStr);
			downloadAnchorNode.setAttribute("download", file.names + ".json");
			document.body.appendChild(downloadAnchorNode);
			downloadAnchorNode.click();
			downloadAnchorNode.remove();
		}
	},
	async created() {
		if(localStorage.getItem('newVersion')){
			if(this.version!==localStorage.getItem('newVersion')){
				localStorage.clear()
			}
		}else{
			localStorage.clear()
		}
		localStorage.setItem('newVersion',this.version)
		if(localStorage.getItem('savedArrFiles')){
			this.arrayFiles=await JSON.parse(localStorage.getItem('savedArrFiles'))
			this.arrayFiles[0].text='текст'
			this.arrayFiles[0].normalize='текст'
			this.arrayFiles[0].dateReady=new Date().getTime()
			this.arrayFiles[0].chunks=[{test:{start:30,word:'word'},text:'asdad'}]
			this.openUpload=false;

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
		margin-top: 15px;
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
	.back{
		place-content: flex-start;
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
		height: 100px;
	}
	.greyBlockTitle img{
		margin-bottom: 10px;
		position: absolute;
		top: -7px;
		right: -8px;
	}
	.greyBlockTitle span{
		overflow: hidden;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		padding: 0 10px;
	}
	.greyBlockBody{
		margin: 15px 0;
		background: #C4C4C4;
		border-radius: 10px;
		display: grid;
		place-content: center;
		padding: 15px 0;
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
		height: 50px;
	}
	.backGroundBlock{
		width: 100%;
		position: fixed;
		z-index: -1;
		background: #00000059;
		height: 100vh;
		top: 0;
	}
	.myModalBlock{
		width: 100%;
		position: fixed;
		text-align: center;
		min-width: 100%;
		display: grid;
		place-items: center;
		z-index: 1;
		height: 100vh;
		touch-action: none;
		top: 0;
	}
	.myModalBlock .myModal{
		background: white;
		border-radius: 5px;
		padding: 15px 15px 75px 15px;
		height: 675px;
		max-width: 1000px;
		position: relative;
		width: 100%;
	}
	.modalWatch-enter-active {
		animation: surfacingBlock .5s ease;
	}
	.modalWatch-leave-active {
		animation: surfacingBlock .3s ease reverse;
	}
	@keyframes surfacingBlock {
		0% {
			top: -100%;
			opacity: 0;
		}
		100% {
			top:0;
			opacity: 1;
		}
	}
	.titleModal{
		font-size: 24px;
		margin-bottom: 15px;
		padding-right: 50px;
	}
	.closeModal{
		position: absolute;
		font-size: 60px;
		right: 15px;
		top: -15px;
		cursor: pointer;
	}
	.bodyModal{
		text-align: left;
		overflow: hidden;
		height: 410px;
	}
	.contentBody{
		height: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	.footerModal{
		position: absolute;
		bottom: 15px;
		width: 100%;
		display: flex;
		place-content: center;
	}
	.footerModal .greyButtonBlock:first-child{
		margin-right: 7.5px;
	}
	.footerModal .greyButtonBlock:last-child{
		margin-l: 7.5px;
	}
	.speekerBlock img{
		height: 100%;
	}
	.speekerBlock{
		display: flex;
		height: 120px;
		margin-bottom: 20px;
		position: relative;
	}
	.blockImg{
		height: 120px;
	}
	.contentBody::-webkit-scrollbar, .contentBody::-webkit-scrollbar, .contentBody::-webkit-scrollbar {height: 5px;background-color: white;}
	.contentBody::-webkit-scrollbar-thumb, .contentBody::-webkit-scrollbar-thumb, .contentBody::-webkit-scrollbar-thumb{background: #C4C4C4; border-radius: 5px;}
	.contentBody::-webkit-scrollbar-thumb:hover, .contentBody::-webkit-scrollbar-thumb:hover, .contentBody::-webkit-scrollbar-thumb:hover{background: #C4C4C4;}
	.contentBody::-webkit-scrollbar-thumb:focus, .contentBody::-webkit-scrollbar-thumb:focus, .contentBody::-webkit-scrollbar-thumb:focus{background: #C4C4C4;}
	.infoFile{
		font-size: 16px;
		text-align: left;
	}
	.timeBlock {
		display: flex;
		margin-bottom: 15px;
		border-bottom: 2px solid #017d89;
	}
	.timeBlock .time{
		text-decoration: underline;
		margin-right: 15px;
	}
	.timeBlock .text{
		overflow-wrap: anywhere;
	}
</style>