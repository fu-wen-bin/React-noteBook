import { useParams, useSearchParams } from 'react-router'

export default function NoteList () {

  // 获取当前路由信息
  const [searchParams] = useSearchParams()
  // 获取路由参数
  console.log(searchParams.get('category'))

  const params = useParams()

  return (
    <div>
      NoteList ---- {params.category}
    </div>
  )
}