function errors(msg) {
    return {
        success: false,
        data: {},
        msg: msg
    }
}
var errorCode = [
    '1001', // token無效
];
var errorMsg = {
    '1001': 'token無效',
    login: '賬號或密碼錯誤',
    queryFail: '查詢失敗',
    uploadFail: '上传失败',
    accountExist: '用户名已存在'
};

module.exports = {
    errors,
    errorCode,
    errorMsg
};
