const path = require('path');
const multer = require('multer');
const uuidv1 = require('uuid/v1');
const {getMimeType, getExtensionName} = require('./methods');
const uploadPath = path.resolve(__dirname, '../uploadFiles');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, uuidv1() + getMimeType(file.mimetype));
    }
});
const baseUpload = multer({storage: fileStorage});


module.exports = {
    baseUpload,
    uploadPath
};
