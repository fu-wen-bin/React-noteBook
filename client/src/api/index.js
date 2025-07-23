import axios from 'axios'

// 设置axios的默认地址配置
axios.defaults.baseURL = 'http://localhost:3000'

// 告诉浏览器如果发送的是 post 请求，后端数据一定会以json格式返回。
// 此时浏览器需要以解析 json 的方式来解析响应体
axios.defaults.headers.post['Content-Type'] = 'application/json'

export default axios