const config = require('../config')

// 数据库相关操作
const mysql = require('mysql2/promise')

// 创建数据库连接池
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
})

// 执行sql查询
const allServices = {
  async query (sql, values) {
    try {
      // 使用连接池执行查询
      const conn = await pool.getConnection()
      // 执行各种增删改查的sql语句操作
      const [rows] = await conn.query(sql, values) // rows是查询结果，fields是字段信息
      // 释放连接
      pool.releaseConnection(conn)
      // 返回查询结果
      return Promise.resolve(rows)
    } catch (error) {
      // 发生错误时，返回错误信息
      return Promise.reject(error)
    }
  },
}

// 登录接口要执行的函数
const userLogin = (username, password) => {
  // 1. 构建查询语句
  const sql = 'SELECT * FROM user WHERE username = ? AND password = ?'
  // 2. 执行查询
  return allServices.query(sql, [username, password])
}

// 查找账户是否存在
const findUser = (username) => {
  const sql = 'SELECT * FROM user WHERE username = ?'
  return allServices.query(sql, [username])
}

const userRegister = (data) => {
  // 1. 构建插入语句
  const sql = `INSERT INTO user (username, password, nickname, create_time)
               VALUES ('${data.username}', '${data.password}', '${data.nickname}',
                       '${data.create_time}');`
  // 2. 执行插入
  return allServices.query(sql, [data.username, data.password, data.nickname, data.create_time])
}

// 根据笔记类型查找列表数据

const findNoteListByType = (note_type, userName) => {
  // 1. 构建查询语句
  const sql = `SELECT * FROM note WHERE note_type = ? AND username = ?`
  // 2. 执行查询
  return allServices.query(sql, [note_type, userName])
}

// 根据笔记ID查询笔记详情
const findNoteById = (noteId, userName) => {
  // 1. 构建查询语句
  const sql = `SELECT * FROM note WHERE id = ? AND username = ?`
  // 2. 执行查询
  return allServices.query(sql, [noteId, userName])
}

module.exports = {
  userLogin,
  findUser,
  userRegister,
  findNoteListByType,
  findNoteById, // 导出新添加的方法
}