var _err = require('../net/neterr')
var _mysql = require('../stu_mysql');

var isPhoneNum = function (num) {
    if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(num))) {
        return false;
    }
    return true;
}

var generalUserId = function () {
    var timeStamp = Date.now();
    var randomId = "";
    for (var i = 0; i < 7; ++i) {
        if (i > 0) {
            randomId += Math.floor(Math.random() * 10);
        } else {
            randomId += Math.floor(Math.random() * 9) + 1;
        }
    }
    return timeStamp + randomId;
}

var checkPassword = function(str) {
    if (str.length < 6 || str.length > 30) {
        return false;
    }
    return true;
}



exports.net_register = function (req, callback) {
    var phone = req.query.phone;
    var password = req.query.password;
    var deviceType = req.query.device_type;
    var deviceUid = req.query.device_uid;

    var ret = {};

    if (!phone || !password || !deviceType || !deviceUid) {
        ret.code = _err.NULL_ERR;
        callback(ret);
        return;
    }
    
    if (!isPhoneNum(phone)) {
        ret.code = _err.PHONE_ERR;
        callback(ret);
        return;
    }

    if (!checkPassword(password)) {
        ret.code = _err.PASSWORD_ERR;
        callback(ret);
        return;
    }


    var userId = generalUserId();
    var masonry = 0;
    _mysql.sqlm_users_insert(userId, phone, password, deviceType, deviceUid, masonry
           , function (isOK) {
        if (!isOK) {
            ret.code = _err.REGISTER_ERR;
            callback(ret);
            return;
        }
        ret.code = _err.OK;
        callback(ret);
    });
}


exports.net_login = function (req, callback) {
    var phone = req.query.phone;
    var password = req.query.password;

    var ret = {};

    if (!phone || !password) {
        ret.code = _err.NULL_ERR;
        callback(ret);
        return;
    }

    if (!isPhoneNum(phone)) {
        ret.code = _err.PHONE_ERR;
        callback(ret);
        return;
    }

    _mysql.sqlm_users_select_password(phone, function (selPassword) {
        if (selPassword !== password) {
            ret.code = _err.LOGIN_ERR;
            callback(ret);
        } else {
            ret.code = _err.OK;
            callback(ret);
        }
    });
}
