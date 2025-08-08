import React, { useRef, useEffect, useState } from 'react'
import { Palette, Settings } from 'lucide-react'
import { Theme } from '../types'
import { createPortal } from 'react-dom'

interface ThemeSelectorProps {
  currentTheme: Theme
  onThemeChange: (theme: Theme) => void
  isOpen: boolean
  onToggle: () => void
}

const themes: Theme[] = [
  {
    name: '蓝色主题',
    primary: 'from-blue-600 to-blue-800',
    secondary: 'bg-blue-500/20',
    accent: 'bg-blue-400/20',
    background: 'bg-gradient-to-b from-blue-600 to-blue-800',
    text: 'text-white',
    border: 'border-blue-400/20'
  },
  {
    name: '紫色主题',
    primary: 'from-purple-600 to-purple-800',
    secondary: 'bg-purple-500/20',
    accent: 'bg-purple-400/20',
    background: 'bg-gradient-to-b from-purple-600 to-purple-800',
    text: 'text-white',
    border: 'border-purple-400/20'
  },
  {
    name: '绿色主题',
    primary: 'from-green-600 to-green-800',
    secondary: 'bg-green-500/20',
    accent: 'bg-green-400/20',
    background: 'bg-gradient-to-b from-green-600 to-green-800',
    text: 'text-white',
    border: 'border-green-400/20'
  },
  {
    name: '橙色主题',
    primary: 'from-orange-600 to-orange-800',
    secondary: 'bg-orange-500/20',
    accent: 'bg-orange-400/20',
    background: 'bg-gradient-to-b from-orange-600 to-orange-800',
    text: 'text-white',
    border: 'border-orange-400/20'
  },
  {
    name: '粉色主题',
    primary: 'from-pink-600 to-pink-800',
    secondary: 'bg-pink-500/20',
    accent: 'bg-pink-400/20',
    background: 'bg-gradient-to-b from-pink-600 to-pink-800',
    text: 'text-white',
    border: 'border-pink-400/20'
  },
  {
    name: '深色主题',
    primary: 'from-gray-800 to-gray-900',
    secondary: 'bg-gray-500/20',
    accent: 'bg-gray-400/20',
    background: 'bg-gradient-to-b from-gray-800 to-gray-900',
    text: 'text-white',
    border: 'border-gray-400/20'
  }
]

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ 
  currentTheme, 
  onThemeChange, 
  isOpen, 
  onToggle 
}) => {
  const [position, setPosition] = useState<'top' | 'bottom' | 'right' | 'left'>('bottom')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = 200 // 估算下拉框高度
      const dropdownWidth = 192 // w-48 = 12rem = 192px
      const screenHeight = window.innerHeight
      const screenWidth = window.innerWidth
      
      // 检查各个方向的空间
      const spaceAbove = buttonRect.top
      const spaceBelow = screenHeight - buttonRect.bottom
      const spaceLeft = buttonRect.left
      const spaceRight = screenWidth - buttonRect.right
      
      // 优先选择向下显示，这是最自然的方向
      if (spaceBelow > dropdownHeight + 50) {
        // 如果下方空间足够，显示在下方
        setPosition('bottom')
      } else if (spaceAbove > dropdownHeight + 50) {
        // 如果上方空间足够，显示在上方
        setPosition('top')
      } else if (spaceRight > dropdownWidth + 50) {
        // 如果右侧空间足够，显示在右侧
        setPosition('right')
      } else if (spaceLeft > dropdownWidth + 50) {
        // 如果左侧空间足够，显示在左侧
        setPosition('left')
      } else {
        // 如果所有方向空间都不够，强制显示在下方
        setPosition('bottom')
      }
    }
  }, [isOpen])

  // 计算下拉框的位置样式
  const getDropdownPosition = () => {
    switch (position) {
      case 'top':
        return 'bottom-full mb-2'
      case 'right':
        return 'left-full ml-2'
      case 'left':
        return 'right-full mr-2'
      case 'bottom':
      default:
        return 'top-full mt-2'
    }
  }

  // 检查是否需要调整水平位置以避免超出屏幕
  const getHorizontalPosition = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownWidth = 192 // w-48 = 12rem = 192px
      const screenWidth = window.innerWidth
      
      // 根据位置类型调整水平对齐
      if (position === 'right' || position === 'left') {
        // 对于左右位置，垂直居中
        return 'top-1/2 -translate-y-1/2'
      } else {
        // 对于上下位置，检查水平空间
        if (buttonRect.right + dropdownWidth > screenWidth) {
          return 'right-0'
        } else {
          return 'left-0'
        }
      }
    }
    return 'left-0'
  }

  // 获取下拉框的样式
  const getDropdownStyles = () => {
    const styles: React.CSSProperties = {
      maxHeight: '300px',
      overflowY: 'auto'
    }
    
    // 确保下拉框不会超出屏幕边界
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownWidth = 192
      const dropdownHeight = 200
      const screenWidth = window.innerWidth
      const screenHeight = window.innerHeight
      
      if (position === 'right' && buttonRect.right + dropdownWidth > screenWidth) {
        styles.right = '0'
        styles.left = 'auto'
      } else if (position === 'left' && buttonRect.left - dropdownWidth < 0) {
        styles.left = '0'
        styles.right = 'auto'
      }
    }
    
    return styles
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={onToggle}
        className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200 hover:scale-110"
        title="主题设置"
      >
        <Palette size={16} className="text-white" />
      </button>
      
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className={`fixed w-48 bg-white/10 backdrop-blur-md rounded-lg p-3 border border-white/20 shadow-xl z-[99999] animate-in ${
            position === 'top' 
              ? 'slide-in-from-top-2' 
              : position === 'right'
              ? 'slide-in-from-right-2'
              : position === 'left'
              ? 'slide-in-from-left-2'
              : 'slide-in-from-bottom-2'
          } duration-200`}
          style={{
            ...getDropdownStyles(),
            top: buttonRef.current ? buttonRef.current.getBoundingClientRect().bottom + 8 : 0,
            left: (() => {
              if (!buttonRef.current) return 0
              const buttonRect = buttonRef.current.getBoundingClientRect()
              const dropdownWidth = 192 // w-48 = 12rem = 192px
              const screenWidth = window.innerWidth
              
              // 计算最佳位置，确保下拉框不会超出屏幕
              let left = buttonRect.left
              
              // 如果下拉框会超出右边界，调整到左对齐
              if (left + dropdownWidth > screenWidth) {
                left = screenWidth - dropdownWidth - 16 // 16px 边距
              }
              
              // 确保不会超出左边界
              if (left < 16) {
                left = 16
              }
              
              return left
            })(),
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          <div className="text-white/70 text-xs font-medium mb-2 flex items-center gap-2">
            <Settings size={12} />
            主题选择
          </div>
          <div className="grid grid-cols-2 gap-2">
            {themes.map((theme) => (
              <button
                key={theme.name}
                onClick={() => onThemeChange(theme)}
                className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                  currentTheme.name === theme.name
                    ? 'bg-white/30 text-white shadow-lg'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

export default ThemeSelector 