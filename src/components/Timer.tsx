import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import { Theme } from '../types'

interface TimerProps {
  theme: Theme
}

const Timer: React.FC<TimerProps> = ({ theme }) => {
  const [time, setTime] = useState(25 * 60) // 25分钟
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'pomodoro' | 'shortBreak' | 'longBreak'>('pomodoro')

  const times = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  }

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime(prev => prev - 1)
      }, 1000)
    } else if (time === 0) {
      setIsRunning(false)
      // 播放提示音或显示通知
      new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
        .play().catch(() => {})
    }

    return () => clearInterval(interval)
  }, [isRunning, time])

  const startTimer = () => {
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTime(times[mode])
  }

  const switchMode = (newMode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    setMode(newMode)
    setTime(times[newMode])
    setIsRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    return ((times[mode] - time) / times[mode]) * 100
  }

  return (
    <div className={`${theme.secondary} rounded-xl p-4 backdrop-blur-sm transition-all duration-200 hover:scale-105`}>
      {/* 模式切换 */}
      <div className="flex space-x-1 mb-4">
        {(['pomodoro', 'shortBreak', 'longBreak'] as const).map((timerMode) => (
          <button
            key={timerMode}
            onClick={() => switchMode(timerMode)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
              mode === timerMode
                ? 'bg-white/20 text-white shadow-lg'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {timerMode === 'pomodoro' ? '专注' : timerMode === 'shortBreak' ? '短休' : '长休'}
          </button>
        ))}
      </div>

      {/* 时间显示 */}
      <div className="text-center mb-4">
        <div className="text-4xl font-bold text-white mb-2 animate-pulse">
          {formatTime(time)}
        </div>
        
        {/* 进度条 */}
        <div className="w-full bg-white/20 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className="bg-white h-2 rounded-full transition-all duration-1000 ease-linear shadow-lg"
            style={{ width: `${getProgress()}%` }}
          />
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center space-x-3">
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Play size={16} />
            <span>开始</span>
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
          >
            <Pause size={16} />
            <span>暂停</span>
          </button>
        )}
        
        <button
          onClick={resetTimer}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <RotateCcw size={16} />
          <span>重置</span>
        </button>
      </div>
    </div>
  )
}

export default Timer 