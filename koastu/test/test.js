const rmysql = require('./routes/r_mysql')
const rapi = require('./routes/r_api')
const rmodel = require('./routes/r_model')


const sql = require('./mysql/m_mysql')
const hypertrie = require('./model/m_hypertrie')


const testfunc = {
    async testStart(app) {
        //* 1.mysql测试
        app.use(rmysql.routes(), rmysql.allowedMethods());

        //* 2.api: 微信js-sdk
        // app.use(rapi.routes(), rapi.allowedMethods());

        //* 3.小模块测试
        app.use(rmodel.routes(), rmodel.allowedMethods());


        // test
        // sql.delByName()
        // sql.addData()
        // sql.updateByName()

        hypertrie.test_hypertrie();
    }
}

module.exports = testfunc