const mysql=require('mysql');
const MongoClient=require('mongodb').MongoClient;
const mongoConfig = {
    host: '47.107.237.193',
    port:"27017",
    user: 'zhoucw',
    password: 'zxs00000',
    database:'zhoucw'
};
const mysqlConfig = {
    host: '47.107.237.193',
    port:"3306",
    user: 'root',
    password: 'zxs00000',
    database:'zhoucw'
};
const getMongoConnectStr = (user=true) => {
    let userStr = `${mongoConfig.user}:${mongoConfig.password}@`;
    return `mongodb://${user?userStr:''}${mongoConfig.host}:${mobungoConfig.port}/${mongoConfig.database}`;
};
const mongoConnect = () =>{
  return new Promise((res, rej) => {
      MongoClient.connect(getMongoConnectStr(), (err, db) => {
          if (!err) {
              res(db)
          } else {
              rej(err);
          }
      });
  })
};
const mysqlConnect = () => {
    let connect = mysql.createConnection(mysqlConfig);
    connect.connect();
    return connect;
};

module.exports = {
    mongoConnect,
    mysqlConnect,
    mongoConfig,
    mysqlConfig
};
