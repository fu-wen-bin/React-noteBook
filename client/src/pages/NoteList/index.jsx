import { useNavigate, useParams } from 'react-router'
import './index.module.less'
import styles from './index.module.less'
import { NavBar } from 'react-vant'
import { Search } from '@react-vant/icons'
import { useEffect, useState } from 'react'
import axios from '@api'
import Pull from '../../components/Pull/index.jsx'
import formatDate from '@utils'

export default function NoteList () {
  const [noteList, setNoteList] = useState([])

  /*// 获取当前路由信息
  const [searchParams] = useSearchParams()
  // 获取路由参数
  console.log(searchParams.get('category'))*/
  const navigate = useNavigate()
  const params = useParams()
  const [finished, setFinished] = useState(false)
  const page = 1
  const size = 10

  const getData = async (page, size) => {
    axios.get('/findNoteListByType', {
      params: {
        note_type: params.category,
        page: page, // 可以根据需要添加分页参数
        size: size, // 可以根据需要添加分页参数
      },
    })
      .then(res => {
        console.log(res)
        setNoteList(res.data || [])
      })
    console.log(`Fetching notes for category: ${params.category}`)
  }

  // 使用useEffect发送寻找Note的请求
  useEffect(() => {
    // 发送请求获取当前分类下的笔记列表
    getData(page, size)
  }, [])

  const onLoad = async () => { // 释放重新加载
    await getData(1, 10)
    setFinished(true)
  }

  return (
    <div className={styles['note-list']}>
      <header className={styles['header']}>
        <NavBar
          title={params.category}
          leftText="返回"
          rightText={<Search fontSize={20}/>}
          onClickLeft={() => navigate(-1)}
          onClickRight={() => {}}
        />
      </header>
      <Pull onLoad={onLoad} finished={finished} setFinished={setFinished}>
        <section className={styles['section']}>
          <ul>
            {
              noteList.length > 0 ? (
                noteList.map((item) => {
                  return (
                    <li key={item.id}
                        onClick={() => navigate(`/noteDetail?id=${item.id}`)}>
                      <div className={styles['img']}>
                        <img src={item.note_img} alt=""/>
                      </div>
                      <div className={styles['time']}>{formatDate(
                        item.update_time)}</div>
                      <div className={styles['title']}>{item.note_title}</div>
                    </li>
                  )
                })
              ) : (
                <div>暂无笔记</div>
              )
            }
          </ul>
        </section>
      </Pull>
    </div>
  )
}