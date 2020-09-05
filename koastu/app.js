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
  // http://localhost:8189/images/test_img.png
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


  // 支持跨域请求
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
      ctx.body = 200;
    } else {
      await next();
    }
  });

  // 初始化
  mysqlHelp.initMysql(config.MYSQL)


  // 临时路由
  const tmpRouter = require('koa-router')()
  app.use(tmpRouter.routes(), tmpRouter.allowedMethods())
  tmpRouter.get('/', async (ctx, next) => {
    ctx.body = "我的koa测试";
  });

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