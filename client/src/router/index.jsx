import { BrowserRouter, Navigate, useRoutes } from 'react-router'
import React from 'react'

const Login = React.lazy(() => import('../pages/Login'))
const NoteClass = React.lazy(() => import('../pages/NoteClass'))
const NoteList = React.lazy(() => import('../pages/NoteList'))
const NoteDetail = React.lazy(() => import('../pages/NoteDetail'))
const NotePublish = React.lazy(() => import('../pages/NotePublish'))

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
  {
    path: '/noteClass',
    element: <NoteClass/>,
  },
  {
    path: '/noteList/:category',
    element: <NoteList/>,
  },
  {
    path: '/noteDetail',
    element: <NoteDetail/>,
  },
  {
    path: '/notePublish',
    element: <NotePublish/>,
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