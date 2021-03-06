const {MongoClient} = require('mongodb'),
	options=require("../config/config.dev.json").mongodb,
	client = new MongoClient(options.url, options.settings),
	ffmpeg = require("ffmpeg-cli"),
	fs = require('fs'),
	vosk = require('vosk'),
	{ Readable } = require("stream"),
	wav = require("wav"),
	natural = require('natural'),
	tokenizer = new natural.AggressiveTokenizerRu();

const normalize=(text)=>{
	const textTokenizer=tokenizer.tokenize(text.toLowerCase());
	const words=textTokenizer.reduce((a,b)=>{
		if(/^[а-яё\-]+$/.test(b)&&b.length>2){
			const stem=natural.PorterStemmerRu.stem(b)
			if(stem&&!a.includes(stem))a.push(stem)
		}
		return a
	},[])
	return words.join(" ")
}

createAudio=async (name,cb)=>{
	const fileDir="video/"
	const fileName=name.split('.')[0]
	const fileFormat=name.split('.')[1]
	if(fs.existsSync("audio/"+fileName+".wav")) {
		fs.unlinkSync("audio/"+fileName+".wav");
	}
	try {
		ffmpeg.run("-i "+fileDir+fileName+"."+fileFormat+" -acodec pcm_s16le -ar 16000 -ac 1 -f wav audio/"+fileName+".wav")
			.then(cb)

	}catch (e){
		console.log(e)
	}
}
speechToText=async (name)=>{
	return new Promise((res)=>{
		const MODEL_PATH = "model"
		const FILE_NAME = "audio/"+name.split(".")[0]+".wav"
		if (!fs.existsSync(MODEL_PATH)) {
			console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
			process.exit()
		}
		vosk.setLogLevel(0);
		const model = new vosk.Model(MODEL_PATH);
		const wfReader = new wav.Reader();
		const wfReadable = new Readable().wrap(wfReader);
		wfReader.on('format', async ({ audioFormat, sampleRate, channels }) => {
			const rec = new vosk.Recognizer({model: model, sampleRate: sampleRate});
			rec.setMaxAlternatives(5);
			rec.setWords(true);
			const chunks=[];
			let text=""
			for await (const data of wfReadable) {
				const end_of_speech = rec.acceptWaveform(data);
				if (end_of_speech) {
					const chunk=rec.result()
					text+=" "+chunk.alternatives[0].text;
					chunks.push(chunk.alternatives[0]);
				}
			}
			res({text,chunks})
			rec.free();
		});
		fs.createReadStream(FILE_NAME, {'highWaterMark': 4096}).pipe(wfReader).on('finish',
			function (err) {
				model.free();
			});
	})
}

const start=async ()=> {
	await client.connect()
	const db=client.db("test")
	const arrayAudio=await db.collection('video').find({audio:0}).toArray()
	for(let f of arrayAudio){
		await createAudio(f.name,await db.collection('video').update({name:f.name},{$set:{audio:1}}))
	}
	const arrayAudioToText=await db.collection('video').find({ready:0,audio:1}).toArray()
	for(let f of arrayAudioToText){
		const start=new Date()
		const res=await speechToText(f.name)
		await createAudio(f.name,await db.collection('video').update({name:f.name},{
			$set:{
				ready:1,
				text:res.text,
				chunks:res.chunks,
				normalize:normalize(res.text),
				dateReady:new Date(),
				time:new Date()-start
			}
		}))
	}
	console.log(new Date())
	setTimeout(start,10000)
}

start()