const rmysql = require('./routes/r_mysql')
const sql = require('./mysql/m_mysql')


const testfunc = {
    async testStart(app) {
        app.use(rmysql.routes(), rmysql.allowedMethods());

        // test
        // sql.delByName()
        // sql.addData()
        // sql.updateByName()
    }
}

module.exports = testfunc