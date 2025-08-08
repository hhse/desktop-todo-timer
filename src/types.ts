export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

export interface TimerState {
  isRunning: boolean
  time: number
  mode: 'pomodoro' | 'shortBreak' | 'longBreak'
} 