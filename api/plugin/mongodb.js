const register = async (server,configs)=> {
    try {
        return await server.register([
            {
                plugin: require('hapi-mongodb'),
                options: configs.mongodb
            }
        ]);
    } catch (err) {
        console.log(`Error registering swagger plugin: ${err}`);
    }
};
module.exports={register};