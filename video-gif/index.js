const ffmpeg = require("ffmpeg-cli"),
	ffprobe = require('ffprobe');
	ffprobeStatic = require('ffprobe-static');
//ffmpeg.run("-version");
//console.log(ffmpeg.runSync("-version"));
console.log(__dirname)
const fileDir=__dirname+"/video/"
const fileName="3.mp4".split('.')[0]
const fileFormat="3.mp4".split('.')[1]
ffprobe(fileDir+fileName+"."+fileFormat,{ path: ffprobeStatic.path },(err,info)=>{
	if(err)console.log(err)
	const duration=info.streams[0].duration;
	for(let i=0;i<Math.floor(duration/5);i++){
		ffmpeg.run("-ss "+i*5+".0 -t 3 -i "+fileDir+fileName+"."+fileFormat+" -f gif "+__dirname+"/gif/"+fileName+"-"+i+".gif").catch((err)=>{console.log(err)});
	}
	console.log("Ect")
})

