const ffmpeg = require("ffmpeg-cli");
	//ffprobe = require('ffprobe');
	//ffprobeStatic = require('ffprobe-static');
//ffmpeg.run("-version");
//console.log(ffmpeg.runSync("-version"));
console.log(__dirname)
const fileDir=__dirname+"/video/"
const fileName="3.mp4".split('.')[0]
const fileFormat="3.mp4".split('.')[1]
ffmpeg.run("-i "+fileDir+fileName+"."+fileFormat+" -vf fps=1/5 "+__dirname+"/png/thumb%04d.png").catch((err)=>{console.log(err)});
