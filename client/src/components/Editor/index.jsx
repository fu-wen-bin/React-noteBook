import '@wangeditor/editor/dist/css/style.css' // 引入 css
import React, { useEffect, useState } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import styles from './index.module.less'

function MyEditor ({ html, setHtml }) {
  // editor 实例
  const [editor, setEditor] = useState(null) // TS 语法                // JS 语法

  // 工具栏配置
  const toolbarConfig = {
    toolbarKeys: [
      'bold',
      'italic',
      'underline',
      'fontSize',
      'indent',
      'lineHeight',
    ],
  }

  // 编辑器配置
  const editorConfig = {
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div className={styles['editor-wrapper']}>
      <Toolbar
        editor={editor}
        defaultConfig={toolbarConfig}
        mode="default"
        className={styles.toolbar}
      />
      <Editor
        defaultConfig={editorConfig}
        onCreated={setEditor}
        value={html}
        onChange={(editor) => setHtml(editor.getHtml())}
        mode="default"
        style={{ height: '200px', overflowY: 'hidden' }}
        className={styles['editor-content']}
      />
    </div>
  )
}

export default MyEditor