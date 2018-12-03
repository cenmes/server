var express = require('express');
var router = express.Router();
const {reqParam} = require('../src/methods');
const tokenFilter = require('../src/tokenFilter');
const {errors, errorMsg} = require('../src/responseMessage');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const Ms = require('../src/mysqlFun');
const Mg = require('../src/mongo');
const cert = 'test';
/* GET users listing. */
router.get('/', function(req, res, next) {
  next('/userInfo')
});
router.all('/login', (req,res,next) => {
    let {username, pwd} = reqParam(req);
    let sql = 'select id from user where username=? and pwd=?',value = [username, pwd];
    var _mysql = Ms();
    _mysql.query(sql, value).then(async ({results, fields}) => {
        if (results && results.length) {
            let token = jwt.sign({
                name: username
            }, 'test');
            let {db, collection} = await  Mg('token');
            collection.remove({username: username},function (error,result) {
                collection.insert({
                    lasttime: new Date(moment().add(30, 'm').valueOf()),
                    username: username,
                    token: token
                },(err, result) => {
                    if (!err) {
                        res.json({
                            success: true,
                            data: {
                                token: token
                            }
                        })
                    }
                    db.close();
                })
            })
        } else {
            res.json({
                success: false
            })
        }
    }).catch(()=>{
        res.json({
            success: false
        })
    });
});
router.all('/loginout',async (req, res, next) =>{
  let {token} = reqParam(req);
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
    collection.deleteOne({username: decode.username}, (err, result)=> {
      db.close();
      if (!err) {
        res.json({
            success: true
        })
      }
    });
});
//todo 用户名规则，密码规则
router.all('/register', async (req, res, next) => {
  let {username, pwd} = reqParam(req);
  let _mysql = Ms();
  let sql = 'insert ignore into user set ?', value = {username, pwd};
  let {results} =await _mysql.query(sql, value);
  if (results.affectedRows === 1) {
    res.json({
        success: true
    })
  } else {
    res.json(errors(errorMsg.accountExist))
  }
});
router.all('/isAccountExist', (req, res, next) => {
  let {username} = reqParam(req);
  let _mysql= Ms();
  let sql = 'select * from user where username=?', value = [username];
  _mysql.query(sql, value).then(({results, fields}) =>{
    if (results.length) {
        res.json({
            data: {
              isExist: true
            }
        })
    } else {
      res.json({
          data: {
            isExist: false
          }
      })
    }
  }).catch(()=>{
  })
});
router.all('/userInfo', (req, res, next) => {
    let {token} = reqParam(req);
    tokenFilter(token).then((username) => {
        let sql = 'select * from user where username=?',value = [username];
        var _mysql = Ms();
        _mysql.query(sql, value).then(({results, fields}) => {
            if (results && results.length) {
                res.json({
                    success: true,
                    data: {
                        firstname: results[0].firstname,
                        lastname: results[0].lastname,
                        tel: results[0].tel,
                        email: results[0].email
                    }
                })
            }
        })
    }).catch((err) => {
        if (err.message === '1001') {
            res.json(errors(errorMsg[err.message]))
        } else {
            res.json(errorMsg['queryFail'])
        }
    })
});
module.exports = router;
