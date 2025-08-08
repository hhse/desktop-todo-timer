import { useState, useEffect, useRef, useCallback } from 'react'
import TodoList from './components/TodoList'
import Timer from './components/Timer'
import Sidebar from './components/Sidebar'
import ThemeSelector from './components/ThemeSelector'
import { Todo, Theme, AppSettings } from './types'

const defaultTheme: Theme = {
  name: '蓝色主题',
  primary: 'from-blue-600 to-blue-800',
  secondary: 'bg-blue-500/20',
  accent: 'bg-blue-400/20',
  background: 'bg-gradient-to-b from-blue-600 to-blue-800',
  text: 'text-white',
  border: 'border-blue-400/20'
}

function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme)
  const [isThemeOpen, setIsThemeOpen] = useState(false)
  const [settings, setSettings] = useState<AppSettings>({
    theme: defaultTheme,
    autoHide: true,
    hoverDelay: 300
  })
  
  const containerRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 从本地存储加载数据
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    const savedSettings = localStorage.getItem('settings')
    
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
    
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings)
      setSettings(parsedSettings)
      setCurrentTheme(parsedSettings.theme)
    }
  }, [])

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings))
  }, [settings])

  // 鼠标悬停处理
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
    
    if (settings.autoHide && isCollapsed) {
      setIsHovered(true)
      setIsCollapsed(false)
    }
  }, [settings.autoHide, isCollapsed])

  const handleMouseLeave = useCallback(() => {
    if (settings.autoHide && !isCollapsed) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false)
        setIsCollapsed(true)
      }, settings.hoverDelay)
    }
  }, [settings.autoHide, isCollapsed, settings.hoverDelay])

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current)
      }
    }
  }, [])

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

  const handleThemeChange = (theme: Theme) => {
    setCurrentTheme(theme)
    setSettings(prev => ({ ...prev, theme }))
    setIsThemeOpen(false)
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
    setIsHovered(false)
  }

  return (
    <div 
      ref={containerRef}
      className={`fixed top-0 right-0 h-screen transition-all duration-500 ease-out ${
        isCollapsed ? 'w-16' : 'w-80'
      } ${isHovered ? 'z-[9998]' : 'z-40'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`h-full ${currentTheme.background} rounded-l-2xl shadow-2xl backdrop-blur-sm border ${currentTheme.border} relative overflow-hidden`}>
        {/* 背景动画效果 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-xl animate-bounce"></div>
        </div>

        <div className="h-full flex flex-col relative z-10">
          {/* 头部 */}
          <div className={`flex items-center justify-between p-4 border-b ${currentTheme.border} backdrop-blur-sm`}>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${currentTheme.secondary} rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110 hover:rotate-12`}>
                <span className="text-white font-bold text-sm">⏰</span>
              </div>
              {!isCollapsed && (
                <h1 className="text-white font-semibold text-lg animate-in slide-in-from-left duration-300">
                  待办时间
                </h1>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {!isCollapsed && (
                <ThemeSelector
                  currentTheme={currentTheme}
                  onThemeChange={handleThemeChange}
                  isOpen={isThemeOpen}
                  onToggle={() => setIsThemeOpen(!isThemeOpen)}
                />
              )}
              <button
                onClick={toggleCollapse}
                className="text-white/70 hover:text-white transition-all duration-200 hover:scale-110 hover:rotate-180"
              >
                {isCollapsed ? '→' : '←'}
              </button>
            </div>
          </div>

          {/* 内容区域 */}
          {!isCollapsed && (
            <div className="flex-1 overflow-hidden animate-in slide-in-from-right duration-300">
              <div className="h-full flex flex-col">
                {/* 计时器 */}
                <div className={`p-4 border-b ${currentTheme.border}`}>
                  <Timer theme={currentTheme} />
                </div>

                {/* 待办事项 */}
                <div className="flex-1 overflow-hidden">
                  <TodoList
                    todos={todos}
                    onAddTodo={addTodo}
                    onToggleTodo={toggleTodo}
                    onDeleteTodo={deleteTodo}
                    onUpdatePriority={updateTodoPriority}
                    theme={currentTheme}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 侧边栏（收缩时显示） */}
          {isCollapsed && (
            <div className="animate-in slide-in-from-right duration-300">
              <Sidebar 
                todos={todos}
                onToggleTodo={toggleTodo}
                theme={currentTheme}
                onAddTodo={() => {
                  setIsCollapsed(false)
                  setIsHovered(true)
                }}
              />
            </div>
          )}
        </div>

        {/* 悬停指示器 */}
        {isCollapsed && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-16 bg-white/20 rounded-r-lg animate-pulse"></div>
        )}
      </div>
    </div>
  )
}

export default App 