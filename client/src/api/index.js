import axios from 'axios'
import toast from 'react-hot-toast'

// 设置axios的默认地址配置
axios.defaults.baseURL = 'http://localhost:3000'

// 告诉浏览器如果发送的是 post 请求，后端数据一定会以json格式返回。
// 此时浏览器需要以解析 json 的方式来解析响应体
axios.defaults.headers.post['Content-Type'] = 'application/json'

// 响应拦截器--用于处理响应数据(接收两个回调函数：成功回调和错误回调)
axios.interceptors.response.use(response => {
    // 注：当后端返回 4xx 或 5xx 状态码时，axios 会直接抛出异常，不会进入响应拦截器的成功回调

    if (response.status !== 200) {
      // 程序性错误
      toast.error('服务器异常')
      return Promise.reject(response) // 返回一个被拒绝的 Promise，方便程序员捕获异常用于调试
    } else {
      if (response.data.code !== '1') {
        // 逻辑性错误
        toast.error(response.data.message)
        return Promise.reject(response) // 返回一个被拒绝的 Promise，方便程序员捕获异常用于调试
      }
      return Promise.resolve(response.data)
    }
  },
  // 错误回调--在错误回调中处理 4xx 或 5xx 错误
  error => {
    if (error.response) {
      // 有响应数据的错误（4xx, 5xx）
      const { status } = error.response

      if (status === 401) {
        // 未授权错误
        /*toast.error(data.msg)
        // 可以在这里处理跳转到登录页
        setTimeout(() => {
          window.location.href = '/login'
        }, 800)*/

        // 记录未成功的请求
        const originalRequest = error.config

        // 重新请求新的 access_token 和 refresh_token
        const refresh_token = localStorage.getItem('refresh_token')
        if (refresh_token) {
          axios.post('/user/refresh', {
            refresh_token: refresh_token,
          }).then(res => {
            if (res.code === '1') {
              // 成功获取新的 token
              localStorage.setItem('access_token', res.access_token)
              localStorage.setItem('refresh_token', res.refresh_token)
              toast.success('Token刷新成功')

              // 更改原请求的 Authorization 头
              originalRequest.headers.Authorization = res.access_token

              // 重新发送原请求
              return axios(originalRequest)
            }
          })
        }
      }

      if(status === 416){
        toast.error(error.response.data.msg)
        // 可以在这里处理跳转到登录页
        setTimeout(() => {
          window.location.href = '/login'
        }, 800)
      }
    } else {
      // 网络错误或其他错误
      toast.error('网络连接失败')
    }

    return Promise.reject(error)
  },
)

// 请求拦截器--用于处理请求数据
axios.interceptors.request.use(request => {
  // 从浏览器的本地储存中获取token
  const access_token = localStorage.getItem('access_token')
  // 如果token存在，则在请求头中添加Authorization字段
  if (access_token) {
    request.headers.Authorization = access_token
  }
  return request // 请求放行
})

export default axios