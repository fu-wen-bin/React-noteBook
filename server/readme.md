# 服务端逻辑分层

1. 路由层：处理当**前端请求不同的路径**时，**执行对应的响应逻辑**
2. 控制层：执行**响应逻辑时**，**调用对应的服务层方法**
3. 服务层：
4. 数据层

# 框架

koa

# 项目梳理

## 前置知识

1. http请求体和http响应体

   请求体是什么？

   > 请求体是客户端发送给服务器的数据，通常包含用户的登录信息，如用户名和密码。
   > 请求体通常是JSON格式，包含以下字段：

    ```json
    {
      "username": "user123",
      "password": "pass123"
    }
    ```

   响应体是什么？

   > 响应体是服务器返回给客户端的数据，通常包含登录结果和相关信息。
   > 响应体通常是JSON格式，包含以下字段：

    ```json
    {
      "status": "success",
      "message": "Login successful",
      "data": {
        "userId": "12345"
      }
    }
    ```

2. 路由

   > 路由是指将HTTP请求映射到具体地处理函数。当前端请求不同的路径时，执行对应的响应逻辑

   安装：
   ```bash
   npm install @koa/router
   ```

   使用：

   > 将路由中的所有回调函数都被use方法注册到Koa应用中。

3. 跨域问题

    1. https://&ensp;&ensp;&ensp;&ensp;192.168.xx.xx&ensp;&ensp;&ensp;&ensp;:XXXX&ensp;&ensp;&ensp;&ensp;/home
       <br>
       协议&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;域名/IP地址&ensp;&ensp;&ensp;&ensp;&ensp;端口号&ensp;&ensp;&ensp;&ensp;路径
       <br>
       <br>
    2. 为保证服务器端的安全，浏览器自带同源策略：
        - 协议、域名/IP地址、端口号三者必须完全相同，才能认为是同源
          <br>
    3. 解决：
        - 服务器端设置响应头`Access-Control-Allow-Origin`，允许跨域请求
        - 前端使用`JSONP`技术，绕过同源策略限制
        - 前端使用`CORS`技术，允许跨域请求

4. 数据库连接--使用`mysql2`库连接MySQL数据库

   安装：
    ```bash
   npm install mysql2
   ```

   使用：

   ```js
   const mysql = require('mysql2/promise');

   async function connectDB() {
     const connection = await mysql.createConnection({
       host: 'localhost',
       user: 'root',
       password: 'password',
       database: 'test'
     });
     return connection;
   }
   ```

## 一、登录接口

### 路由：`/user/login`

- 请求方法：`POST`  -- POST请求携带的参数都在请求体中，GET请求携带的参数都在URL中
- 请求体：

```json
{
  "username": "user123",
  "password": "pass123"
}
```

- 响应体：

```json
{
  "code": 0,
  "message": "登陆成功",
  "data": {
    "token": "12345"
  }
}
```

### 问题及解决

1. **跨域问题**：前端请求时可能会遇到跨域问题，安装`@koa/cors`库。

    ```js
    const cors = require('@koa/cors')
    // 跨域中间件
    // 必须先让跨域代码在路由之前
    app.use(cors()) // 告诉浏览器允许前端跨域请求
    ```

2. **请求体解析**：使用`@koa/bodyparser`中间件来解析请求体。

    ```js
    const { bodyParser } = require('@koa/bodyparser')
    // 解析请求体中间件
    // 必须先让代码在路由之前
    app.use(bodyParser()) // 辅助koa解析请求体中的数据，ctx.request.body
    ```

## 二、注册接口

### 路由：`/user/register`

- 请求方法：`POST`
- 请求体：

```json
{
  "username": "newUser",
  "password": "newPass",
  "nickname": "newNick"
}
```

- 响应体：

```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "userId": "12345"
  }
}
```

### 问题及解决

1. 防止sql注入，类似`username = '<script>alert('123')</script>'`

直接将传入的参数中的`<`、`>`、`'`和`"`替换为`&lt;`、`&gt;`、`&apos;`和`&quot;`，以防止恶意脚本执行。

```js 
// 规定替换的字符
function sanitizeInput(input) {
  return input
    .replace(/</g, '&lt;')  // 替换小于号
    .replace(/>/g, '&gt;')  // 替换大于号
    .replace(/'/g, '&apos;') // 替换单引号
    .replace(/"/g, '&quot;') // 替换双引号
}

// 使用示例
function sanitizeUserInput(user) {
  return {
    username: sanitizeInput(user.username),
    password: sanitizeInput(user.password),
    nickname: sanitizeInput(user.nickname),
  }
}
```


