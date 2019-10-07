var mysql = require("mysql");

var _pool = null;

function nop(a, b, c, d, e, f, g) {
}

function generateUserId() {
    var Id = "";
    for (var i = 0; i < 6; ++i) {
        if (i > 0) {
            Id += Math.floor(Math.random() * 10);
        } else {
            Id += Math.floor(Math.random() * 9) + 1;
        }
    }
    return Id;
}


function query(sql, callback) {
    _pool.getConnection(function (err, conn) {
        if (err) {
            callback(err, null, null);
        } else {
            conn.query(sql, function (qerr, vals, fields) {
                //释放连接  
                conn.release();
                //事件驱动回调  
                callback(qerr, vals, fields);
            });
        }
    });
};


exports.start = function (cfg) {
    _pool = mysql.createPool({
        host: cfg['HOST'],
        user: cfg['USER'],
        password: cfg['PSWD'],
        database: cfg['DB'],
        port: cfg['PORT'],
    });
};



exports.sqlm_users_insert = function (userId, phone, password, deviceType, deviceUid, masonry, callback) {
    var sql = 'INSERT INTO m_users(user_id,phone_num,password,device_type,device_uid,masonry_num,create_time) VALUES("{0}","{1}","{2}",{3},"{4}",{5},{6})';
    var time = 'now()'
    sql = sql.format(userId, phone, password, deviceType, deviceUid, masonry, time);
    console.log(sql);

    query(sql, function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                callback(false);
                return;
            }
            callback(false);
            throw err;
        } else {
            callback(true);
        }
    });
}


exports.sqlm_users_select_password = function (phone, callback) {
    var sql = 'select password from m_users where phone_num=' + phone;
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        if (rows.length == 0) {
            callback(null);
            return;
        }

        callback(rows[0].password);
    });
}


exports.sqlm_users_update_password = function(phone, password, callback) {
    var sql = 'update m_users set password=' + password + ' where  phone_num=' + phone;
 
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
        } else {
            callback(rows.affectedRows > 0);
        }
    });
}


exports.create_account = function (account, password, callback) {
    callback = callback == null ? nop : callback;
    if (account == null || password == null) {
        callback(false);
        return;
    }

    var sql = 'INSERT INTO t_accounts(account,password) VALUES("' + account + '","' + password + '")';
    query(sql, function (err, rows, fields) {
        if (err) {
            if (err.code == 'ER_DUP_ENTRY') {
                callback(false);
                return;
            }
            callback(false);
            throw err;
        } else {
            callback(true);
        }
    });
};


exports.select_all_users = function (callback) {
    callback = callback == null ? nop : callback;

    var sql = 'SELECT userid,account,name,lv,exp,coins,gems,roomid FROM t_users';
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(null);
            throw err;
        }
        if (rows.length == 0) {
            callback(null);
            return;
        }

        callback(rows);
    });
}


exports.delete_room = function (roomId, callback) {
    callback = callback == null ? nop : callback;
    if (roomId == null) {
        callback(false);
    }
    var sql = "DELETE FROM t_rooms WHERE id = '{0}'";
    sql = sql.format(roomId);
    query(sql, function (err, rows, fields) {
        if (err) {
            callback(false);
            throw err;
        } else {
            callback(true);
        }
    });
}


exports.add_user_gems = function (userid, gems, callback) {
    callback = callback == null ? nop : callback;
    if (userid == null) {
        callback(false);
        return;
    }

    var sql = 'UPDATE t_users SET gems = gems +' + gems + ' WHERE userid = ' + userid;
    console.log(sql);
    query(sql, function (err, rows, fields) {
        if (err) {
            console.log(err);
            callback(false);
            return;
        } else {
            callback(rows.affectedRows > 0);
            return;
        }
    });
};




exports.test_mysql = function(cfg) {
    this.start(cfg);

    var phone = '188989233';
    var password = '123231';
    var deviceType = 1;
    var deviceUid = '123123'


    // this.sqlm_users_insert('3232', phone, password, deviceType, deviceUid, 0, function(isOK){
    //     console.log(isOK)
    // });

    this.sqlm_users_select_password(phone, function (rows) {

    })

    // var account = 'userId' + generateUserId();
    // this.create_account(account, '123456', function(result) {
    //     if(result) {
    //         console.log('create account successful');
    //     } else {
    //         console.log('create account fail');
    //     }
    // });



    // this.select_all_users(function(rows) {
    //     for(var i=0; i<rows.length; i++) {
    //         console.log(rows[i]['account']);
    //     }
    // });
}