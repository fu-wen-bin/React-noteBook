const Koa = require('koa')
const app = new Koa()
const userRouter = require('./router/user.js')
const cors = require('@koa/cors')
const { bodyParser } = require('@koa/bodyparser')

// 跨域中间件
// 必须先让跨域代码在路由之前
app.use(cors()) // 告诉浏览器允许前端跨域请求

// 解析请求体中间件
// 必须先让代码在路由之前
app.use(bodyParser()) // 辅助koa解析请求体中的数据，ctx.request.body

/*app.use(async (ctx) => {
  console.log(ctx)
  if(ctx.request.url === '/home'){
    ctx.body = 'Hello, World!'
  }
})*/

// useRouter 是一个对象，不是函数
// 1. 被 app.use 调用的函数中一定拥有参数 ctx
// 2. userRouter.routes() 就是 user.js 中所有被定义好的路由的回调函数
app.use(userRouter.routes(), userRouter.allowedMethods())

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})