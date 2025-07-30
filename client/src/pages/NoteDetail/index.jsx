import styles from './index.module.less'
import { ArrowLeft } from '@react-vant/icons'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from '@api'
import toast from 'react-hot-toast'
import { useSearchParams } from 'react-router'

export default function NoteDetail () {
  const [noteDetail, setNoteDetail] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  const [searchParams] = useSearchParams()
  const noteId = searchParams.get('id')
  const category = searchParams.get('category')

  useEffect(() => {

    if (!noteId) {
      toast.error('笔记ID不存在')
      setTimeout(() => {
        navigate(-1)
      }, 1000)
      return
    }

    // 调用API获取笔记详情
    const fetchNoteDetail = async () => {
      try {
        setLoading(true)
        // 显示加载中的提示
        toast.loading('加载中...')

        const res = await axios.get('/findNoteById', {
          params: { id: noteId },
        })

        // 无论成功失败，先清除加载提示
        toast.dismiss()

        if (res.code === '1' && res.data) {
          // 查询成功
          setNoteDetail(res.data)
          toast.success('查询成功')
        } else {
          // 查询失败
          toast.error(res.message || '获取笔记详情失败')
          setTimeout(() => {
            navigate(`/noteList/${category}`)
          }, 1000)
        }
      } catch (error) {
        toast.dismiss()
        console.error('获取笔记详情失败:', error)
        toast.error('获取笔记详情失败')
        setTimeout(() => {
          navigate(`/noteList/${category}`)
        }, 1000)
      } finally {
        setLoading(false)
      }
    }
    fetchNoteDetail()
  }, [location, navigate])

  // 返回上一页
  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return <div className={styles['loading']}>加载中...</div>
  }

  if (!noteDetail) {
    return <div className={styles['error']}>笔记不存在或已被删除</div>
  }

  return (
    <div className={styles['note-detail']}>
      <div className={styles['back']} onClick={handleBack}>
        <ArrowLeft/>
      </div>

      {noteDetail.note_img && (
        <div className={styles['note-img']}>
          <img src={noteDetail.note_img} alt=""/>
        </div>
      )}

      <div className={styles['note-content']}>
        <div className={styles['tab']}>
          <span className={styles['note_type']}>{noteDetail.note_type}</span>
          <span className={styles['author']}>{userInfo.nickname}</span>
        </div>
        <p className={styles['title']}>{noteDetail.note_title}</p>
        <div className={styles['content']}>
          {noteDetail.note_content && (
            <div
              dangerouslySetInnerHTML={{ __html: noteDetail.note_content, }}
            />
          )}
        </div>
      </div>
    </div>
  )
}