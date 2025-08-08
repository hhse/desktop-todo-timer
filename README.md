# 桌面待办时间程序

一个美观的桌面待办事项和计时器应用，支持自动收缩到桌面边缘，鼠标悬停展开。

## 功能特性

- 🎯 **番茄钟计时器** - 支持专注、短休息、长休息模式
- 📝 **待办事项管理** - 添加、完成、删除、优先级设置
- 🎨 **美观界面** - 类似QQ的现代化设计风格
- 📍 **智能收缩** - 自动收缩到桌面右侧，鼠标悬停展开
- 💾 **数据持久化** - 本地存储待办事项
- 🔔 **提醒功能** - 计时结束自动提醒
- 🎨 **毛玻璃效果** - 现代化的视觉设计

## 技术栈

- **Electron** - 桌面应用框架
- **React** - 前端框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

## 安装和运行

### 开发环境

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

### 构建应用

1. 构建生产版本：
```bash
npm run build
```

2. 打包为可执行文件：
```bash
npm run dist
```

## 使用说明

1. **添加待办事项**：在输入框中输入任务内容，按回车或点击加号按钮
2. **完成任务**：点击待办事项前的圆圈标记为完成
3. **设置优先级**：点击旗帜图标循环切换优先级（低/中/高）
4. **删除任务**：点击任务右侧的删除图标
5. **使用计时器**：选择专注/短休/长休模式，点击开始按钮
6. **收缩界面**：点击右上角的收缩按钮，界面会收缩到右侧边缘
7. **展开界面**：鼠标悬停在收缩的界面上会自动展开

## 项目结构

```
├── src/
│   ├── components/     # React组件
│   │   ├── Timer.tsx   # 计时器组件
│   │   ├── TodoList.tsx # 待办列表组件
│   │   └── Sidebar.tsx # 侧边栏组件
│   ├── types.ts        # TypeScript类型定义
│   ├── App.tsx         # 主应用组件
│   └── main.tsx        # 应用入口
├── electron/           # Electron主进程
│   ├── main.ts         # 主进程文件
│   └── preload.ts      # 预加载脚本
├── dist/               # 构建输出目录
└── package.json        # 项目配置
```

## 自定义配置

### 修改计时器时间

在 `src/components/Timer.tsx` 中修改 `times` 对象：

```typescript
const times = {
  pomodoro: 25 * 60,    // 专注时间（秒）
  shortBreak: 5 * 60,   // 短休息时间（秒）
  longBreak: 15 * 60    // 长休息时间（秒）
}
```

### 修改界面位置

在 `electron/main.ts` 中修改窗口位置和大小：

```typescript
mainWindow = new BrowserWindow({
  width: 320,           // 窗口宽度
  height: height,       // 窗口高度
  x: width - 320,       // X坐标（右侧）
  y: 0,                 // Y坐标（顶部）
  // ...
})
```

## 许可证

MIT License 