import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { TodosState } from './interface'

const selectTodosState = (state: RootState): TodosState => state.todos

const selectVisibleTodos = createSelector([selectTodosState], (state: TodosState) => {
  const { todos, selectedFilter } = state
  if (selectedFilter === 'active') return todos.filter((t) => !t.completed)
  if (selectedFilter === 'completed') return todos.filter((t) => t.completed)
  return todos
})

export { selectTodosState, selectVisibleTodos }
