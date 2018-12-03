const {errorCode} = require('./responseMessage');
const jwt = require('jsonwebtoken');
const Mg = require('./mongo');
const moment = require('moment');
const cert = 'test';
module.exports = async (token) => {
    let decode = await new Promise((res, rej) => {
        jwt.verify(token, cert ,(err, decode) => {
            if (!err) {
                res(decode)
            } else {
                throw new Error(errorCode[0])
            }
        })
    });
    let {db, collection} = await Mg('token');
    let rows = await new Promise((res, rej) => {
        collection.find({username: decode.name}).toArray((err, rows) => {
            if (!err) {
                res(rows)
            } else {
                rej();
            }
        });
    });
    if (rows && rows.length) {
        collection.update({username: decode.username},{
            lasttime: new Date(moment().add(30, 'm').valueOf())
        },function(error,res){
            db.close();
        });
        return decode.name;
    } else {
        throw new Error(errorCode[0])
    }
};
