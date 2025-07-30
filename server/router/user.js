const Router = require('@koa/router')
const router = new Router()
const { userLogin, findUser, userRegister } = require('../controllers/index.js')
const { sign, refreshVerify } = require('../utils/jwt.js')
const { escape } = require('../utils/security.js')
const { verify } = require('../utils/jwt')

router.prefix('/user') // 路由前缀，所有路由都以 /user 开头

// 登录接口
router.post('/login', async (ctx) => {
  // 1. 获取请求体中的数据
  // POST请求携带的参数都在请求体中
  let { username, password } = ctx.request.body
  console.log(`Received username: ${username}, password: ${password}`)
  username = escape(username) // 转义标签
  password = escape(password) // 转义标签

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

// 注册接口
router.post('/register', async (ctx) => {
  let { username, password, nickname } = ctx.request.body
  // 验证数据不能为空
  if (!username || !password || !nickname) {
    ctx.body = {
      code: '0',
      message: '用户名、密码和昵称不能为空',
      data: {},
    }
  }

  // 转义标签
  username = escape(username)
  password = escape(password)
  nickname = escape(nickname)

  try {
    // 检验账号是否存在
    const res = await findUser(username)
    if (res.length) {
      ctx.body = {
        code: '0',
        message: '用户名已存在',
        data: {},
      }
      return
    }
    // 数据库写入
    const result = await userRegister(
      { username, password, nickname, create_time: Date.now() })
    if (result.affectedRows > 0) {
      // 注册成功
      ctx.body = {
        code: '1',
        message: '注册成功',
        data: {
          id: result.id,
          username,
          nickname,
          create_time: Date,
        },
      }

    } else {
      // 注册失败
      ctx.body = {
        code: '0',
        message: '注册失败，请稍后再试',
        data: {},
      }
    }
  } catch (error) {
    ctx.body = {
      code: '-1',
      message: '服务器错误',
      error: error.message,
    }
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

router.post('/access',verify(), (ctx) => {
  // 这个接口用于验证 access_token 是否有效
  // 如果有效，返回用户信息
  ctx.body = {
    code: '1',
    msg: 'access_token 验证成功',
  }
})


module.exports = router