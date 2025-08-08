import React from 'react'
import { CheckCircle, Circle, Clock } from 'lucide-react'
import { Todo } from '../types'

interface SidebarProps {
  todos: Todo[]
  onToggleTodo: (id: number) => void
}

const Sidebar: React.FC<SidebarProps> = ({ todos, onToggleTodo }) => {
  const uncompletedTodos = todos.filter(todo => !todo.completed)
  const completedTodos = todos.filter(todo => todo.completed)

  return (
    <div className="h-full flex flex-col items-center py-4 space-y-4">
      {/* 未完成待办 */}
      <div className="flex flex-col items-center space-y-2">
        <div className="text-white/70 text-xs font-medium">待办</div>
        <div className="flex flex-col items-center space-y-1">
          {uncompletedTodos.slice(0, 3).map((todo) => (
            <button
              key={todo.id}
              onClick={() => onToggleTodo(todo.id)}
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              title={todo.text}
            >
              <Circle size={16} className="text-white" />
            </button>
          ))}
          {uncompletedTodos.length > 3 && (
            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
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
            {completedTodos.slice(0, 2).map((todo) => (
              <div
                key={todo.id}
                className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"
                title={todo.text}
              >
                <CheckCircle size={16} className="text-green-400" />
              </div>
            ))}
            {completedTodos.length > 2 && (
              <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                <span className="text-green-400/70 text-xs">+{completedTodos.length - 2}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 时间显示 */}
      <div className="flex flex-col items-center space-y-2 mt-auto">
        <div className="text-white/70 text-xs font-medium">时间</div>
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
          <Clock size={16} className="text-white" />
        </div>
      </div>
    </div>
  )
}

export default Sidebar 