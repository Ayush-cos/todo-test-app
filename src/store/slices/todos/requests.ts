import { createAsyncThunk } from '@reduxjs/toolkit'
import type { RootState } from '@/store'
import type { TodoItem } from './interface'
import axiosLib from 'axios'

export const fetchTodos = createAsyncThunk<TodoItem[], void, { state: RootState }>(
  'todos/fetchTodos',
  async (_, thunkAPI) => {
    const source = axiosLib.CancelToken.source()
    thunkAPI.signal.addEventListener('abort', () => source.cancel())
    try {
      // For demo we use a fake local response to avoid external API calls.
      // In a real app you'd call `await service({ method: HttpMethod.GET, url: GET_TODOS_ENDPOINT, cancelToken: source.token })`
      await new Promise((r) => setTimeout(r, 300))
      const demoData: TodoItem[] = [
        { id: '1', text: 'Learn Redux Toolkit', completed: false },
        { id: '2', text: 'Build a demo app', completed: true },
      ]
      return demoData
    } catch (error: unknown) {
      if (axiosLib.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ?? error.response?.data ?? error.message
        )
      }
      return thunkAPI.rejectWithValue('Unknown error')
    }
  },
  { condition: (_p, { getState }) => !getState().todos.isLoadingTodos }
)

export const addTodo = createAsyncThunk<
  TodoItem,
  { text: string },
  { state: RootState }
>(
  'todos/addTodo',
  async (payload, thunkAPI) => {
    const source = axiosLib.CancelToken.source()
    thunkAPI.signal.addEventListener('abort', () => source.cancel())
    try {
      await new Promise((r) => setTimeout(r, 300))
      const newTodo: TodoItem = {
        id: String(Date.now()),
        text: payload.text,
        completed: false,
      }
      return newTodo
    } catch (error: unknown) {
      if (axiosLib.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ?? error.response?.data ?? error.message
        )
      }
      return thunkAPI.rejectWithValue('Unknown error')
    }
  },
  { condition: (_p, { getState }) => !getState().todos.isLoadingAddTodo }
)
