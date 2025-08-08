import React from 'react'
import { CheckCircle, Circle, Clock, Plus } from 'lucide-react'
import { Todo, Theme } from '../types'

interface SidebarProps {
  todos: Todo[]
  onToggleTodo: (id: number) => void
  theme: Theme
  onAddTodo?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ todos, onToggleTodo, theme, onAddTodo }) => {
  const uncompletedTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  return (
    <div className="h-full flex flex-col items-center py-4 space-y-4">
      {/* 添加按钮 */}
      {onAddTodo && (
        <div className="flex flex-col items-center space-y-2">
          <button
            onClick={onAddTodo}
            className={`w-8 h-8 ${theme.secondary} rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110 hover:rotate-90`}
            title="添加待办"
          >
            <Plus size={16} className="text-white" />
          </button>
        </div>
      )}

      {/* 未完成待办 */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-white/70 text-xs font-medium">待办</div>
        <div className="flex flex-col items-center space-y-1">
          {uncompletedTodos.slice(0, 3).map((todo, index) => (
            <button
              key={todo.id}
              onClick={() => onToggleTodo(todo.id)}
              className={`w-8 h-8 ${theme.secondary} rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110 hover:rotate-12`}
              title={todo.text}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <Circle size={16} className="text-white" />
            </button>
          ))}
          {uncompletedTodos.length > 3 && (
            <div className={`w-8 h-8 ${theme.accent} rounded-lg flex items-center justify-center animate-pulse`}>
              <span className="text-white/70 text-xs">+{uncompletedTodos.length - 3}</span>
            </div>
          )}
        </div>
      </div>

      {/* 已完成待办 */}
      {completedTodos.length > 0 && (
        <div className="flex flex-col items-center space-y-2">
          <div className="text-white/70 text-xs font-medium">完成</div>
          <div className="flex flex-col items-center space-y-1">
            {completedTodos.slice(0, 2).map((todo, index) => (
              <div
                key={todo.id}
                className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                title={todo.text}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <CheckCircle size={16} className="text-green-400" />
              </div>
            ))}
            {completedTodos.length > 2 && (
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center animate-pulse">
                <span className="text-green-400/70 text-xs">+{completedTodos.length - 2}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 时间显示 */}
      <div className="flex flex-col items-center space-y-2 mt-auto">
        <div className="text-white/70 text-xs font-medium">时间</div>
        <div className={`w-8 h-8 ${theme.secondary} rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110`}>
          <Clock size={16} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default Sidebar 