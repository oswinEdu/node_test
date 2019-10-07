err = {
    OK:0,
    NULL_ERR:999,                                   //字段不全
    PHONE_ERR:1000,                                 //手机号错误
    PASSWORD_ERR:1001,                              //密码位数不对 6-30
    REGISTER_ERR:1002,                              //注册失败
    LOGIN_ERR: 1003,                                //登录账号或密码出错
    TOKEN_ERR:1004,                                 //token验证不通过
    TOKEN_EXPIRE_ERR:1005,                          //token过期
}


module.exports = err;