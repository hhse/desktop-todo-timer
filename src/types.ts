export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: string
  priority: 'low' | 'medium' | 'high'
}

export interface Theme {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  text: string
  border: string
}

export interface AppSettings {
  theme: Theme
  autoHide: boolean
  hoverDelay: number
}

export interface TimerState {
  isRunning: boolean
  time: number
  mode: 'pomodoro' | 'shortBreak' | 'longBreak'
} 