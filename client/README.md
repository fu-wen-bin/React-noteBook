# 移动端适配

rem:相对于页面根字体的大小

例如：根字体为10px，1rem = 10px。

**一个容器设置为10rem宽，当用户使用更大屏幕的设备时，我们需要将根字体调大**

# UI 库

Ant-Design-Mobile

React-Vant

# CSS预处理器

Less

# 重置默认样式

rest.css

# 项目梳理

# 路由配置 -- 安装路由react-router-dom

## 集中式路由配置

- 将所有的路由配置集中在一个文件中，便于管理和维护。

## 路由的懒加载

- 使用React.lazy和Suspense实现路由的懒加载，减少初始加载时间。
- 将每个路由都用React.lazy包裹，当用户访问该路由时，才会加载该路由组件，而不是一进入就加载全部组件的代码。

***

✅ 懒加载优点

- 减少初始加载时间：用户首次访问时，只加载必要资源，提升响应速度。
- 节省带宽和内存：避免加载未使用的资源，优化服务器和客户端性能。
- 提升用户体验：尤其适用于移动端或大型应用，减少卡顿和等待时间。
- 动态扩展性：按需加载资源，适合数据量大或交互复杂的场景。

⚠️ 懒加载缺点

- 增加后续操作延迟：首次访问未加载的资源时，可能需要额外等待。
- 实现复杂度较高：需处理加载状态、错误边界（如`Suspense`）和资源回收。
- 潜在内容闪烁：若未使用占位符，可能因加载延迟导致界面突兀变化。

# 开发登录页

## CSS 样式隔离 -- xxx.module.css

## 登录接口请求 -- axios ~~(XMLHttpRequest, fetch)~~

前后端联调/服务器部署 -- 请求接口代码示范：

> axios.post(http://192.168.xx.xx:3000/api/login, {username, password})

`axios`配置文件(axios.defaults.baseURL = 'http://192.168.xx.xx:3000')后：

> axios.post("/api/login", {username, password})

## 登录鉴权

1. 用户未登录就访问首页时，首页在加载时会向后端发送请求
2. 后端在登录接口中生成一个令牌，将令牌一起返回给前端，前端进行浏览器本地保存
    - 可以使用`localStorage`或`sessionStorage`来保存令牌
    - 例如：`localStorage.setItem('token', response.data.token)`
3. 前端必须在后续所有的请求中携带这个令牌供后端校验，如果后端不通过则返回`401`状态码
4. 前端收到后端返回的信息后就执行相应操作

## 问题及解决

1. `Vant`移动端组件库某些组件不兼容`React19`，出现样式问题。

   解决方案：使用其他第三方库来替换需要的组件，或者使用`Ant Design Mobile`等其他`UI`库。

2. 登录鉴权的token在规定时间后会过期，过期后就需要重新登录 -- **需要无感刷新**

   解决方案：
      - 在登录时，后端返回同时返回两个token，一个时效短的`access token`，一个时效长的`refresh token`
      - `access token`用于权限校验，`refresh token`用于获取新的`access token`
      - 在`access token`过期后到`refresh token`过期前，接口再次被调用时，前端会自动请求获取新的`access token`和`refresh token`