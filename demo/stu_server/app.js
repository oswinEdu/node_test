var prototype = require('./utils/meprototype');


exports.cfg_mysql = function () {
    var config = {
        HOST: '127.0.0.1',
        USER: 'root',
        PSWD: '123456',         //如果连接失败，请检查这里
        DB: 'nodejs',           //如果连接失败，请检查这里
        PORT: 3306,
    }
    return config;
}

exports.cfg_express = function () {
    return {
        SERVER_PORT: 8212,
    }
}

exports.cfg_http = function () {
    return {
        SERVER_URL: "",
    }
}



// var stu_mysql = require('./stu_mysql');
// stu_mysql.test_mysql(this.cfg_mysql())

var stu_express = require('./stu_express');
// stu_express.test_catch_static_express();
// stu_express.start(this.cfg_express());

// var stu_crypto = require('./stu_crypto');
// stu_crypto.test_crypto();


var test = require('../test/test')
// test.tesg_func()
// test.test_jwt();
// test.test_msg();
// test.test_express();
test.test_dir_look();


var down = require('./net/netdownload');
// down.test_downrequest()

