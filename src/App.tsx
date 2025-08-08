import { useState, useEffect } from 'react'
import TodoList from './components/TodoList'
import Timer from './components/Timer'
import Sidebar from './components/Sidebar'
import { Todo } from './types'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)

  // 从本地存储加载待办事项
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // 保存待办事项到本地存储
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: 'medium'
    }
    setTodos([...todos, newTodo])
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const updateTodoPriority = (id: number, priority: 'low' | 'medium' | 'high') => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, priority } : todo
    ))
  }

  return (
    <div 
      className={`fixed top-0 right-0 h-screen transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-80'
      }`}
    >
      <div className="h-full bg-gradient-to-b from-blue-600 to-blue-800 rounded-l-2xl shadow-2xl backdrop-blur-sm border border-blue-400/20">
        <div className="h-full flex flex-col">
          {/* 头部 */}
          <div className="flex items-center justify-between p-4 border-b border-blue-400/20">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">⏰</span>
              </div>
              {!isCollapsed && (
                <h1 className="text-white font-semibold text-lg">待办时间</h1>
              )}
            </div>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white/70 hover:text-white transition-colors"
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>

          {/* 内容区域 */}
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                {/* 计时器 */}
                <div className="p-4 border-b border-blue-400/20">
                  <Timer />
                </div>

                {/* 待办事项 */}
                <div className="flex-1 overflow-hidden">
                  <TodoList
                    todos={todos}
                    onAddTodo={addTodo}
                    onToggleTodo={toggleTodo}
                    onDeleteTodo={deleteTodo}
                    onUpdatePriority={updateTodoPriority}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 侧边栏（收缩时显示） */}
          {isCollapsed && (
            <Sidebar 
              todos={todos}
              onToggleTodo={toggleTodo}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App 