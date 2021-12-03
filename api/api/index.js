const Joi = require('joi');
const fs = require('fs');

exports.plugin = {
    name: 'index',
    version: '0.0.1',
    register: async (server,options) => {
        server.route({
            method: 'GET',
            path: '/video/{name}',
            config: {
                async handler(req) {
                    const name=req.params.name;
                    const db = req.mongo.db;
                    const data=await db.collection('video').findOne({name:name})
                    console.log(data)
                    return {err:false,data}
                },
                description: 'Проверка подключения к БД',
                tags: ['api'],
                validate: {
                    params: Joi.object({
                        name: Joi.string().required()
                    })
                }
            }
        });
        server.route({
            method: 'GET',
            path: '/task/{id}',
            config: {
                async handler(req) {
                    const id=req.params.id;
                    const db = req.mongo.db;
                    const ObjectID = req.mongo.ObjectID;
                    const data=await db.collection('task').findOne({_id:new ObjectID(id)})
                    console.log(data)
                    return {err:false,data}
                },
                description: 'Проверка подключения к БД',
                tags: ['api'],
                validate: {
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            }
        });
        server.route({
            method: 'POST',
            path: '/task/{num}',
            config: {
                async handler(req) {
                    const db = req.mongo.db;
                    let data = req.payload, {num} = req.params;
                    const files = num === 1 ? [data.file] : data.file;
                    const names = num === 1 ?[data.file.hapi.filename] : data.file.map(f=>f.hapi.filename);
                    let name='',path='';
                    const array_name=[];
                    let dir = "./video";
                    if (!fs.existsSync(dir)) {
                        fs.mkdirSync(dir,{ recursive: true });
                    }
                    try {
                        for(let i in files){
                            name=new Date().getTime()+i+"."+names[i].split(".")[1];
                            array_name.push(name)
                            await db.collection('video').insertOne({name,ready:0,create:new Date(),dateReady:0,audio:0})
                            files[i].pipe(fs.createWriteStream(dir + "/"+name))
                        }
                        const {insertedId}=await db.collection('task').insertOne({names,array_name,ready:0,create:new Date(),dateReady:0})
                        return {err:false, text:"Файлы загружены",id:insertedId}
                    }catch (err) {
                        console.log(err);
                        if(path){
                            if(fs.existsSync(path)) {
                                fs.unlinkSync(path);
                            }
                        }
                        return {err:true,text:"Произошла ошибка при подключении к базе данных, повторите попытку позже"}
                    }
                    return {err:false}
                },
                payload: {
                    output: 'stream',
                    parse: true,
                    allow: 'multipart/form-data',
                    maxBytes: 1024 * 1024 * 100,
                    multipart: true
                },
                tags: ['api'],
                validate: {
                    params: Joi.object({
                        num: Joi.number().integer().min(1).required()
                    }),
                    payload: Joi.object({
                        file: Joi.any()
                    })
                }
            }
        });
    }
}