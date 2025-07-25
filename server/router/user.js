const Router = require('@koa/router')
const router = new Router()
const { userLogin } = require('../controllers/index.js')
const { sign, verify, refreshVerify } = require('../utils/jwt.js')

router.prefix('/user') // 路由前缀，所有路由都以 /user 开头

// 登录接口
router.post('/login', async (ctx) => {
  // 1. 获取请求体中的数据
  // POST请求携带的参数都在请求体中
  const { username, password } = ctx.request.body
  console.log(`Received username: ${username}, password: ${password}`)

  // 2. 模拟登录验证--检验账号密码是否合法
  try {
    const res = await userLogin(username, password)
    if (res.length) { // 有长度代表有数据，返回登录成功
      // 这里不可以直接用res判断，因为对象不管空不空布尔值都为true
      let data = {
        id: res[0].id,
        username: res[0].username,
        nickname: res[0].nickname,
        create_time: res[0].create_time,
      }

      const access_token = sign(data, '1h')
      const refresh_token = sign(data, '7d')

      ctx.body = {
        code: '1', // 提示前端这种状态码代表登陆成功--用于处理逻辑错误
        message: '登录成功',
        data: data,
        access_token,
        refresh_token,

      }
    } else { // 逻辑性错误
      ctx.body = {
        code: '0', // 提示前端这种状态码代表登陆失败--用于处理逻辑错误
        message: '用户名或密码错误',
        data: {},
      }
    }
  } catch (error) { // 程序性错误，返回错误信息
    ctx.body = {
      code: '-1',
      message: '服务器错误',
      error: error.message,
    }
  }
})

router.get('/test', verify(), (ctx) => {
  // 该路由需要token验证
  ctx.body = {
    code: '1',
    message: '验证通过',
  }
})

// 刷新 token
router.post('/refresh', (ctx) => {
  const { refresh_token } = ctx.request.body
  // 校验refresh_token是否有效
  const decoded = refreshVerify(refresh_token)
  if (decoded.id) {
    // 创建新的 长短 token
    // console.log(decoded);
    const data = {
      id: decoded.id,
      username: decoded.username,
      nickname: decoded.nickname,
      create_time: decoded.create_time,
    }
    const access_token = sign(data, '1h')
    const refresh_token = sign(data, '7d')
    ctx.body = {
      code: '1',
      msg: 'token刷新成功',
      access_token: access_token,
      refresh_token: refresh_token,
    }

  } else {  // 长 token 都过期了
    ctx.status = 416
    ctx.body = {
      code: '0',
      msg: '登录状态已过期，请重新登录',
    }
  }
})

module.exports = router