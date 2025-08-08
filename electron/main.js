"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
let mainWindow = null;
let isCollapsed = false;
let isQuiting = false;
function createWindow() {
    const { width, height } = electron_1.screen.getPrimaryDisplay().workAreaSize;
    mainWindow = new electron_1.BrowserWindow({
        width: 320,
        height: height,
        x: width - 320,
        y: 0,
        frame: false,
        transparent: true,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    // 加载应用
    if (process.env.NODE_ENV === 'development') {
        // 开发环境
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    }
    else {
        // 生产环境 - 加载构建后的文件
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
    // 窗口失去焦点时设置透明度
    mainWindow.on('blur', () => {
        if (mainWindow && !isCollapsed) {
            mainWindow.setOpacity(0.3);
        }
    });
    // 窗口获得焦点时恢复透明度
    mainWindow.on('focus', () => {
        if (mainWindow) {
            mainWindow.setOpacity(1);
        }
    });
    // 防止窗口被关闭
    mainWindow.on('close', (event) => {
        if (!isQuiting) {
            event.preventDefault();
            mainWindow?.hide();
        }
    });
}
electron_1.app.whenReady().then(createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
// IPC 处理
electron_1.ipcMain.handle('toggle-collapse', () => {
    if (!mainWindow)
        return;
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
        // 收缩到右侧
        mainWindow.setSize(50, mainWindow.getSize()[1]);
        mainWindow.setPosition(electron_1.screen.getPrimaryDisplay().workAreaSize.width - 50, 0);
    }
    else {
        // 展开
        mainWindow.setSize(320, mainWindow.getSize()[1]);
        mainWindow.setPosition(electron_1.screen.getPrimaryDisplay().workAreaSize.width - 320, 0);
    }
    return isCollapsed;
});
electron_1.ipcMain.handle('get-window-state', () => {
    return isCollapsed;
});
// 退出应用
electron_1.ipcMain.handle('quit-app', () => {
    isQuiting = true;
    electron_1.app.quit();
});
