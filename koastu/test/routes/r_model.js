const router = require('koa-router')()
const utils = require('../utils/m_utils')

router.prefix('/model')


// ! hypertrie
router.get('/hypertrie', async (ctx, next) => {
    ctx.body = 'this is a users mysql!'
});



module.exports = router