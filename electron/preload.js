"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// 暴露安全的API给渲染进程
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    // 切换收缩状态
    toggleCollapse: () => electron_1.ipcRenderer.invoke('toggle-collapse'),
    // 获取窗口状态
    getWindowState: () => electron_1.ipcRenderer.invoke('get-window-state'),
    // 退出应用
    quitApp: () => electron_1.ipcRenderer.invoke('quit-app'),
    // 获取屏幕尺寸
    getScreenSize: () => electron_1.ipcRenderer.invoke('get-screen-size'),
    // 最小化窗口
    minimizeWindow: () => electron_1.ipcRenderer.invoke('minimize-window'),
    // 关闭窗口
    closeWindow: () => electron_1.ipcRenderer.invoke('close-window')
});
