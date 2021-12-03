const ffmpeg = require("ffmpeg-cli"),
	ffprobe = require('ffprobe');
ffprobeStatic = require('ffprobe-static');
//ffmpeg.run("-version");
//console.log(ffmpeg.runSync("-version"));
console.log(__dirname)
const fileDir=__dirname+"/video/"
const fileName="4.mp4".split('.')[0]
const fileFormat="4.mp4".split('.')[1]
ffprobe(fileDir+fileName+"."+fileFormat,{ path: ffprobeStatic.path },(err,info)=>{
	if(err)console.log(err)
	//const duration=info.streams[0].duration;
	ffmpeg.run("-i "+fileDir+fileName+"."+fileFormat+" -acodec pcm_s16le -ar 16000 -ac 1 -f wav "+__dirname+"/audio/"+fileName+".wav").catch((err)=>{console.log(err)});
	//console.log("Ect")
})