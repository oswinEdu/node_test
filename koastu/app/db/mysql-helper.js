const mysql = require("mysql")

var pool = null;

let initMysql = function(cfg) {
    pool = mysql.createPool(cfg)
}


let query = function (sql, args) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                resolve(err)
            } else {
                connection.query(sql, args, (err, result) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(result)
                    }
                    connection.release()

                })
            }
        })
    })
}

module.exports = {
    query,
    initMysql
}