import React, { useState } from 'react'
import { useAppDispatch } from '../hooks'
import { addTodo } from '../store/slices/todos/requests'

export default function AddTodo() {
  const [text, setText] = useState('')
  const dispatch = useAppDispatch()

  const onAdd = async () => {
    if (!text.trim()) return
    await dispatch(addTodo({ text }))
    setText('')
  }

  return (
    <div className="controls">
      <input
        className="todo-input"
        placeholder="Add todo..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={onAdd}>Add</button>
    </div>
  )
}
