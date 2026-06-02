import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TodosState } from './interface'
import { handleFetchTodos, handleAddTodo } from './extra-reducers'
import { fetchTodos, addTodo } from './requests'

const initialState: TodosState = {
  todos: [],
  isLoadingTodos: false,
  errorTodos: null,

  isLoadingAddTodo: false,

  selectedFilter: 'all',
  uiPagination: { currentPage: 1, limit: 10 },
}

const slice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    setFilter(state, action: PayloadAction<TodosState['selectedFilter']>) {
      state.selectedFilter = action.payload
    },
  },
  extraReducers: (builder) => {
    handleFetchTodos(builder)
    handleAddTodo(builder)
  },
})

export const { setFilter } = slice.actions
export { fetchTodos, addTodo }
export type { TodosState } from './interface'
export default slice.reducer
