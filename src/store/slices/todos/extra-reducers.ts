import { ActionReducerMapBuilder } from '@reduxjs/toolkit'
import { TodosState } from './interface'
import { fetchTodos, addTodo } from './requests'

export function handleFetchTodos(builder: ActionReducerMapBuilder<TodosState>) {
  builder
    .addCase(fetchTodos.pending, (state) => {
      state.isLoadingTodos = true
      state.errorTodos = null
    })
    .addCase(fetchTodos.fulfilled, (state, action) => {
      state.isLoadingTodos = false
      state.todos = action.payload
      state.errorTodos = null
    })
    .addCase(fetchTodos.rejected, (state, action) => {
      state.isLoadingTodos = false
      state.errorTodos = action.payload as string
    })
}

export function handleAddTodo(builder: ActionReducerMapBuilder<TodosState>) {
  builder
    .addCase(addTodo.pending, (state) => {
      state.isLoadingAddTodo = true
    })
    .addCase(addTodo.fulfilled, (state, action) => {
      state.isLoadingAddTodo = false
      state.todos.push(action.payload)
    })
    .addCase(addTodo.rejected, (state) => {
      state.isLoadingAddTodo = false
    })
}
