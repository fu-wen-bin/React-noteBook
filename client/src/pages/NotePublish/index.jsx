import { useState } from 'react'
import Editor from '@/components/Editor'
import {
  ActionSheet,
  Button,
  Cell,
  Dialog,
  hooks,
  Input,
  NavBar,
  Uploader,
} from 'react-vant'
import { Arrow } from '@react-vant/icons'
import styles from './index.module.less'
import { useNavigate } from 'react-router'
import toast from 'react-hot-toast'
import axios from '@api'
import useNoteClassStore from '../../store/noteClass.js'

export default function NotePublic () {
  const { noteClassList, addClass } = useNoteClassStore()
  const navigate = useNavigate()
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  const actions = [
    ...noteClassList.map(item => ({ name: item.title })),
    { name: '添加新分类', color: '#1989fa' },
  ]

  const [state, updateState] = hooks.useSetState({
    title: '',
  })

  const [noteImg, setNoteImg] = useState('')
  const [noteType, setNoteType] = useState('美食')
  const [visible, setVisible] = useState(false)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [html, setHtml] = useState('')  // 编辑器内容

  const onSelect = (item) => {
    setVisible(false)
    if (item.name === '添加新分类') {
      setDialogVisible(true)
    } else {
      setNoteType(item.name)
    }
  }

  const onConfirm = () => {
    if (newClassName) {
      addClass({
        title: newClassName,
        id: Date.now(),
      })
      setNoteType(newClassName)
      setNewClassName('')
    }
    setDialogVisible(false)
  }

  const onPublish = () => {
    console.log(html)
    if (html.length <= 11) {
      toast.error('内容不能为空')
      return
    }
    if (!state.title) {
      toast.error('标题不能为空')
      return
    }
    // 这里可以添加发布日记的逻辑，比如发送请求到服务器

    axios.post('/note-publish', {
      note_title: state.title,
      note_content: html,
      note_img: noteImg,
      note_type: noteType,
      username: userInfo.username,
    }).then(res => {
      console.log(res)

    })
    toast.success('日记已发布')
    navigate(-1) // 发布成功后返回上一页
  }

  return (
    <div className={styles['note-public']}>
      <NavBar
        title="写日记"
        onClickLeft={() => navigate(-1)}
      />
      <div className={styles.content}>
        <div className={styles.editor}>
          <Editor setHtml={setHtml} html={html}/>
        </div>
        <div className={styles['note-wrap']}>
          <Cell>
            <Input
              prefix={'标题：'}
              value={state.title}
              onChange={title => updateState({ title })}
              placeholder="请输入标题"
              clearable
            />
          </Cell>

          <Cell>
            <Uploader
              uploadText="上传封面"
              accept="*"
              onChange={v => setNoteImg(v[0].url)}
              maxCount={1}
            />
          </Cell>

          <Cell>
            <div className={styles['type-select']}
                 onClick={() => { setVisible(true) }}>
              <span>选择分类</span>
              <span className={styles['type-name']}>
              {noteType}
                <Arrow/>
            </span>
            </div>
          </Cell>

          <ActionSheet
            visible={visible}
            actions={actions}
            onSelect={onSelect}
            onClose={() => setVisible(false)}
            cancelText="取消"
            duration={250}
          />

          <Dialog
            title="添加新分类"
            visible={dialogVisible}
            showCancelButton
            onConfirm={onConfirm}
            onCancel={() => setDialogVisible(false)}
          >
            <Input
              value={newClassName}
              onChange={setNewClassName}
              placeholder="请输入新分类名称"
            />
          </Dialog>
        </div>

        <div className={styles.btn}>
          <Button type="primary" block onClick={onPublish}>发布日记</Button>
        </div>
      </div>
    </div>
  )
}