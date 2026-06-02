export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface UiPagination {
  currentPage: number
  limit: number
}

export interface TodosState {
  // GET /todos
  todos: TodoItem[]
  isLoadingTodos: boolean
  errorTodos: string | null

  // POST /todos
  isLoadingAddTodo: boolean

  // UI
  selectedFilter: 'all' | 'active' | 'completed'
  uiPagination: UiPagination
}
