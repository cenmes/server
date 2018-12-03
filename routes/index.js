var express = require('express');
var router = express.Router();
const {baseUpload,uploadPath} = require('../src/uploadFile');
const {errors,errorMsg} = require('../src/responseMessage');
const {getExtensionName} = require('../src/methods');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql');
const Ms = require('../src/mysqlFun');
/* GET home page. */
router.get('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin","*");
    next();
});
router.all('/test', async (req, res,next) => {
  let _mysql = Ms();
  let rows = await _mysql.insertMul('user',['username', 'pwd'], [['a','1'],['b','2']]);
  res.json({
      data:rows
  })
});
router.post('/upload', baseUpload.single('file'), (req, res, next) => {
    if (!req.file) {
        return res.json(errors(errorMsg.uploadFail));
    }
    let _mysql = Ms();
    _mysql.query('INSERT INTO uploadfiles SET ?', [{uploaderId: 'ccc', uploadtime: new Date().getTime()}]).then((r) => {
        let id = r.insertId;
        fs.rename(path.resolve(__dirname, `${uploadPath}/${req.file.filename}`), path.resolve(__dirname, `${uploadPath}/${id+getExtensionName(req.file.filename)}`),(err) => {
            console.log(err);
        });
        res.json({
            success: true,
            data: {
                url: id,
                path: `http://localhost:3000/uploads/${id+getExtensionName(req.file.filename)}`
            }
        })
    }).catch((e) => {
        res.json(errors(errorMsg.uploadFail))
    })
});
module.exports = router;
