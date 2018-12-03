const getMimeType = (mime) =>{
    var type = '';
    switch (mime) {
        case 'image/jpeg':
            type = '.jpg';
            break;
    }
    return type;
};
const getExtensionName = (name) =>{
    return `.${name.split('.').pop()}`;
};
function reqParam(req) {
    if(req.method==="GET"){
        return req.query;
    }else if (req.method==="POST"){
        return req.body
    }
}
module.exports = {
    getMimeType,
    getExtensionName,
    reqParam
};
