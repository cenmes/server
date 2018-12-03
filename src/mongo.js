const {mongoConfig} = require('./config');
const MongoClient=require('mongodb').MongoClient;
const getMongoConnectStr = (user=true) => {
    let userStr = `${mongoConfig.user}:${mongoConfig.password}@`;
    return `mongodb://${user?userStr:''}${mongoConfig.host}:${mongoConfig.port}/${mongoConfig.database}`;
};
module.exports = async (connection) => {
    let db = await new Promise((res, rej) => {
        MongoClient.connect(getMongoConnectStr(), (err, db) => {
            if (!err) {
                res(db)
            } else {
                rej(err);
            }
        });
    });
    return {
        db,
        collection: db.db(mongoConfig.database).collection(connection)
    }
};
