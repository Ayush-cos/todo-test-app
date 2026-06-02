import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../hooks'
import { fetchTodos } from '../store/slices/todos/requests'
import { selectVisibleTodos, selectTodosState } from '../store/slices/todos/selectors'

export default function TodoList() {
  const dispatch = useAppDispatch()
  const todos = useAppSelector(selectVisibleTodos)
  const { isLoadingTodos } = useAppSelector(selectTodosState)

  useEffect(() => {
    dispatch(fetchTodos())
  }, [dispatch])

  if (isLoadingTodos) return <div>Loading...</div>

  return (
    <ul className="todo-list">
      {todos.map((t) => (
        <li key={t.id} className="todo-item">
          <span>{t.text}</span>
          <small>{t.completed ? 'Done' : 'Open'}</small>
        </li>
      ))}
    </ul>
  )
}
