const mysql = require('../mysql/m_mysql')

const router = require('koa-router')()

router.prefix('/mysql')

router.get('/', async (ctx, next) => {
    // mysql.searchByName()

    ctx.body = 'this is a users mysql!'
})

module.exports = router