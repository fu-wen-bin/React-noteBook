import axios from '../../api'
import { useEffect } from 'react'
import styles from './index.module.less'

export default function NoteClass () {

  useEffect(() => {
    axios.get('/user/test').then(res => {
      console.log(res)
    })
  }, [])

  return (
    <div className={styles['note-class-wrapper']}>

    </div>
  )
}