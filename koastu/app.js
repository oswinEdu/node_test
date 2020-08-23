const Koa = require('koa')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const index = require('./routes/index')
const users = require('./routes/users')

const mysqlHelp = require('./app/db/mysql-helper')
const config = require('./config/config');

const test = require('./test/test')


; (async () => {
  const app = new Koa()

  // error handler
  onerror(app)


  // middlewares
  app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
  }))
  app.use(json())
  app.use(logger())
  
  // 静态资源
  // http: //localhost:8189/images/test_img.png
  app.use(require('koa-static')(__dirname + '/static'))
  // 网页
  app.use(views(__dirname + '/views', {
    extension: 'pug'
  }))


  // logger
  app.use(async (ctx, next) => {
    const start = new Date()
    await next()
    const ms = new Date() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
  })


  // 初始化
  mysqlHelp.initMysql(config.MYSQL)


  // 路由
  app.use(index.routes(), index.allowedMethods())
  app.use(users.routes(), users.allowedMethods())


  // 启动测试
  test.testStart(app)


  // error-handling
  app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
  });

  app.listen(config.SERVER_PORT, () => {
    console.log(`Starting at port ${config.SERVER_PORT}!`)
  });

  // module.exports = app
  })()