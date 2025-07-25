import logo from '../../assets/logo.png'
import styles from './index.module.less'
import React from 'react'
import { Button, Form, Input } from 'react-vant'
import axios from '../../api'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router'

export default function Login () {

  const [form] = Form.useForm()
  const navigate = useNavigate()

  const onFinish = values => {
    console.log(values)
    axios.post('/user/login', values)
      .then(res => {
        console.log(res)
        // 将token存储到localStorage中
        localStorage.setItem('access_token', res.access_token)
        localStorage.setItem('refresh_token', res.refresh_token)
        // 登录成功弹窗
        toast.success(res.message)
        navigate('/noteClass')
      })
  }

  return (
    <div className={styles.login}>
      <h1 className={styles.title}>登录</h1>

      <div className={styles['login-wrapper']}>
        <div className={styles.avatar}>
          <img className={styles['avatar-img']} src={logo} alt="日记本logo"/>
        </div>
        <Form
          form={form}
          onFinish={onFinish}
          footer={
            <div style={{ margin: '16px 16px 0' }}>
              <Button round nativeType="submit" type="primary" block>
                登录
              </Button>
            </div>
          }
        >
          <Form.Item
            rules={[{ required: true, message: '请填写用户名' }]}
            name="username"
            label="用户名"
            labelWidth={120}
            labelAlign={'center'}
          >
            <Input placeholder="请输入用户名"/>
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: '请填写密码' }]}
            name="password"
            label="密码"
            labelWidth={120}
            labelAlign={'center'}
          >
            <Input placeholder="请输入密码"/>
          </Form.Item>
        </Form>
      </div>

      <p className={styles['login-tip']}>
        没有账号？<a href="/register">点这注册</a>
      </p>
    </div>
  )
}