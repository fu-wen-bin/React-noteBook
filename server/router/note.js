const Router = require('@koa/router')
const router = new Router()
const { verify } = require('../utils/jwt')
const { findNoteListByType, findNoteById } = require('../controllers/index.js')

// router.prefix('/note') // 路由前缀，所有路由都以 /user 开头

router.get('/findNoteListByType', verify(), async (ctx) => {
  const { note_type } = ctx.request.query // 从url后解析参数

  try {
    const res = await findNoteListByType(note_type, ctx.userName)
    console.log(res)
    if (res.length) { // 有长度代表有数据，返回查询成功
      ctx.body = {
        code: '1', // 提示前端这种状态码代表查询成功--用于处理逻辑错误
        message: '查询成功',
        data: res,
      }
    } else { // 逻辑性错误
      ctx.body = {
        code: '0', // 提示前端这种状态码代表查询失败--用于
        message: '没有找到相关笔记',
        data: [],
      }
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: '-1',
      message: '服务器错误',
      error: error.message,
    }
  }
})

router.get('/findNoteById', verify(), async (ctx) => {
  const { id } = ctx.request.query // 从url获取笔记ID参数

  try {
    const res = await findNoteById(id, ctx.userName)
    if (res.length > 0) { // 找到对应笔记
      ctx.body = {
        code: '1',
        message: '查询成功',
        data: res[0], // 返回第一个匹配的笔记
      }
    } else { // 未找到笔记
      ctx.body = {
        code: '0',
        message: '未找到该笔记',
        data: [],
      }
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      code: '-1',
      message: '服务器错误',
      error: error.message,
    }
  }
})

module.exports = router