import React, { useState } from 'react'
import { Plus, Trash2, CheckCircle, Circle, Flag } from 'lucide-react'
import { Todo } from '../types'

interface TodoListProps {
  todos: Todo[]
  onAddTodo: (text: string) => void
  onToggleTodo: (id: number) => void
  onDeleteTodo: (id: number) => void
  onUpdatePriority: (id: number, priority: 'low' | 'medium' | 'high') => void
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onUpdatePriority
}) => {
  const [newTodo, setNewTodo] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTodo.trim()) {
      onAddTodo(newTodo.trim())
      setNewTodo('')
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400'
      case 'medium': return 'text-yellow-400'
      case 'low': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  const sortedTodos = [...todos].sort((a, b) => {
    // 未完成的排在前面
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // 按优先级排序
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })

  return (
    <div className="h-full flex flex-col">
      {/* 添加新待办 */}
      <div className="p-4 border-b border-blue-400/20">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="添加新待办事项..."
            className="flex-1 bg-white/10 text-white placeholder-white/50 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20"
          />
          <button
            type="submit"
            className="bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>

      {/* 待办列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sortedTodos.length === 0 ? (
          <div className="text-center text-white/50 py-8">
            <div className="text-4xl mb-2">📝</div>
            <p>暂无待办事项</p>
            <p className="text-sm">添加一些任务开始你的高效工作吧！</p>
          </div>
        ) : (
          sortedTodos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white/10 rounded-lg p-3 backdrop-blur-sm transition-all hover:bg-white/15 ${
                todo.completed ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                {/* 完成状态 */}
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className="flex-shrink-0 mt-0.5"
                >
                  {todo.completed ? (
                    <CheckCircle size={20} className="text-green-400" />
                  ) : (
                    <Circle size={20} className="text-white/70 hover:text-white" />
                  )}
                </button>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`text-sm font-medium ${
                        todo.completed ? 'line-through text-white/60' : 'text-white'
                      }`}
                    >
                      {todo.text}
                    </span>
                    <Flag 
                      size={14} 
                      className={`${getPriorityColor(todo.priority)} cursor-pointer`}
                      onClick={() => {
                        const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high']
                        const currentIndex = priorities.indexOf(todo.priority)
                        const nextPriority = priorities[(currentIndex + 1) % priorities.length]
                        onUpdatePriority(todo.id, nextPriority)
                      }}
                    />
                  </div>
                  
                  {/* 时间 */}
                  <div className="text-xs text-white/50">
                    {new Date(todo.createdAt).toLocaleString('zh-CN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="flex-shrink-0 text-white/50 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 统计信息 */}
      {todos.length > 0 && (
        <div className="p-4 border-t border-blue-400/20">
          <div className="flex justify-between text-sm text-white/70">
            <span>总计: {todos.length}</span>
            <span>已完成: {todos.filter(t => t.completed).length}</span>
            <span>完成率: {Math.round((todos.filter(t => t.completed).length / todos.length) * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TodoList 