import styles from './index.module.less'
import { Cross, Success } from '@react-vant/icons'
import { useEffect } from 'react'

const toastObj = {
  showToast: true, // 是否显示Toast
  duration: 3000, // Toast持续时间，单位毫秒
  msg: '登录成功', // Toast显示的消息内容
  type: 'success', // Toast类型，success或fail
}

const newToastObj = new Proxy(toastObj, {
  set (target, prop, value) {
    target[prop] = value
    return true
  },
})

export default function Toast () {

  const { showToast, duration, msg, type } = newToastObj // 从toastObj中解构出需要的属性

  useEffect(() => {
    // 设置定时器，duration毫秒后自动关闭
    setTimeout(() => {
      // 关闭Toast
      toastObj.showToast = false
    }, duration)

  }, [])

  return (showToast && (
    <div className={styles.toast}>
      <div className={styles['toast-content']}>
        <div className={styles['toast-content-icon']}>
          {type === 'success' && <Success/>}
          {type === 'fail' && <Cross/>}
        </div>
        <div className={styles['toast-content-title']}>{msg}</div>
      </div>
    </div>
  ))
}