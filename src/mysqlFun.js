const mysql = require('mysql');
const {mysqlConfig} = require('./config');
const mysqlConnect = () => {
    let connect = mysql.createConnection(mysqlConfig);
    connect.connect();
    return connect;
};
class Ms {
    constructor (collection) {
        this.collection = collection;
    }
    // 通用查询
    query (sql, values) {
        return new Promise((resolve, reject) => {
            var query = this.collection.query(sql, values, (err, results, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({results, fields})
                }
            });
        });
    }
    insert (table, value) {
        return new Promise((resolve, reject) => {
            this.collection.query(`insert into ${table} set ?`,value,(err, results, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results.insertId)
                }
            });
        });
    }
    insertMul (table,keys,values) {
        var keysStr = keys.join(',');
        return new Promise((resolve, reject) => {
            this.collection.query(`insert into ${table}(${keysStr}) values ?`,[values],(err, results, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(results)
                }
            });
        });
    }
    close () {
        this.collection.end();
    }
}
/*
* use ms(collection).query(sql,values).then({rows,fields}=>{}).catch((err)=>{})
* */
module.exports = () => {
    return new Ms(mysqlConnect());
};
