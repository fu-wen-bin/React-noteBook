import { create } from 'zustand'

const useNoteClassStore = create((set) => ({
  noteClassList: [
    { title: '美食'},
    { title: '旅行'},
    { title: '恋爱'},
    { title: '学习'},
    { title: '吵架'},
  ],
  addClass: (newClass) => set(state => ({
    noteClassList: [...state.noteClassList, newClass],
  })),
}))

export default useNoteClassStore
