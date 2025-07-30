import { useEffect, useState } from 'react'
import styles from './index.module.less'
import { Edit, LikeO, Search, WapNav } from '@react-vant/icons'
import Menu from '@components/Menu'
import { useNavigate } from 'react-router'
import useNoteClassStore from '../../store/noteClass.js'
import axios from '@api'


// 随机颜色，颜色偏亮色系
const randomColor = () => {
  const r = Math.floor(Math.random() * 100) + 100
  const g = Math.floor(Math.random() * 100) + 100
  const b = Math.floor(Math.random() * 100) + 100
  return `rgb(${r}, ${g}, ${b})`
}

export default function NoteClass () {


  const varifyToken = localStorage.getItem('access_token')

  const verifyUser = async () => {
    axios.post('/user/access')
      .then(res => {
        console.log(res)
      })
  }

  useEffect(() => {
    verifyUser()
  }, [varifyToken])

  const { noteClassList } = useNoteClassStore()
  const [showMenu, setShowMenu] = useState(false)
  const navigate = useNavigate()

  function goNoteList (category) {
    // 这里的 category 是 noteClassList 中的 title
    // 这种方法需要在配置路由时使用动态路由，即在路由中使用 :category 来表示动态参数
    navigate(`/noteList/${category}`)

    // 也可以用?进行传参
    // navigate(`/noteList?category=${category}`)
    // 这种方式需要在 NoteList 中使用 useLocation 来获取路由参数
    // const location = useLocation()
    // const category = new URLSearchParams(location.search).get('category')
  }

  return (
    <div className={styles['note-class-wrapper']}>
      <div className={[
        `${styles['note-class']}`,
        `${showMenu ? styles['hide'] : ''}`].join(' ')}>
        <header>
          <div onClick={() => {setShowMenu(true)}}>
            <WapNav className={styles['icon']}/>
          </div>
          <div>
            <Edit className={styles['icon']}
                  onClick={() => navigate('/notePublish')}/>
            <LikeO className={styles['icon']}/>
            <Search className={styles['icon']}/>
          </div>
        </header>
        <section>
          {
            noteClassList.map(item => {
              return (
                <div key={item.title} className={styles['note-class-item']}
                     style={{ backgroundColor: randomColor() }}
                     onClick={() => {goNoteList(item.title)}}
                >
                  <span
                    className={styles['note-class-item-title']}>{item.title}</span>
                </div>
              )
            })
          }
        </section>
      </div>

      <div className={[
        `${styles['menu']}`,
        `${showMenu ? styles['show'] : ''}`].join(' ')}>
        <Menu setShowMenu={setShowMenu}/>
      </div>
    </div>
  )
}
