import { contextBridge, ipcRenderer } from 'electron';

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 切换收缩状态
  toggleCollapse: () => ipcRenderer.invoke('toggle-collapse'),
  
  // 获取窗口状态
  getWindowState: () => ipcRenderer.invoke('get-window-state'),
  
  // 退出应用
  quitApp: () => ipcRenderer.invoke('quit-app'),
  
  // 获取屏幕尺寸
  getScreenSize: () => ipcRenderer.invoke('get-screen-size'),
  
  // 最小化窗口
  minimizeWindow: () => ipcRenderer.invoke('minimize-window'),
  
  // 关闭窗口
  closeWindow: () => ipcRenderer.invoke('close-window')
});

// 类型声明
declare global {
  interface Window {
    electronAPI: {
      toggleCollapse: () => Promise<boolean>;
      getWindowState: () => Promise<boolean>;
      quitApp: () => Promise<void>;
      getScreenSize: () => Promise<{ width: number; height: number }>;
      minimizeWindow: () => Promise<void>;
      closeWindow: () => Promise<void>;
    };
  }
} 