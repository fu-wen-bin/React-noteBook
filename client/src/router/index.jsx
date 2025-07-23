import { BrowserRouter, Navigate, useRoutes } from 'react-router'
import React from 'react'

const Login = React.lazy(() => import('../pages/Login'))
const routes = [
  {
    path: '/',
    element: <Navigate to="/noteClass"/>,
  },
  {
    path: '/login',
    // React.lazy 用于按需加载组件 -- 懒加载
    element: <Login/>,
  },
]

function WrapperRoutes () {
  // useRoutes 是 react-router-dom v6.4+ 的新特性
  // useRoutes 只能用在路由组件中，也就是说该组件不能被抛出
  return useRoutes(routes)
  // 上述代码得到的是：
  /*
  <Routes>
    {/!*重定向自动去首页，如果未登录则去登录页*!/}
    <Route path="/" element={<Navigate to="/noteClass"/>}/>
    <Route path="/login" element={<Login/>}/>
  </Routes>
  */
}

export default function WrapperRouter () {
  return (
    <BrowserRouter>
      <WrapperRoutes/>
    </BrowserRouter>
  )
}