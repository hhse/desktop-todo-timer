import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';

// 扩展App类型
declare global {
  namespace NodeJS {
    interface Global {
      isQuiting?: boolean;
    }
  }
}

let mainWindow: BrowserWindow | null = null;
let isCollapsed = false;
let isQuiting = false;

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
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
    // 开发环境 - 尝试多个端口
    const tryPorts = async () => {
      const ports = [3000, 3001, 3002, 3003, 3004, 3005];
      
      for (const port of ports) {
        try {
          await mainWindow!.loadURL(`http://localhost:${port}`);
          console.log(`成功连接到端口 ${port}`);
          mainWindow!.webContents.openDevTools();
          return;
        } catch (error) {
          console.log(`端口 ${port} 不可用，尝试下一个...`);
          continue;
        }
      }
      
      // 如果所有端口都失败，显示错误
      console.error('无法连接到开发服务器，请确保 Vite 正在运行');
    };
    
    tryPorts();
  } else {
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

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC 处理
ipcMain.handle('toggle-collapse', () => {
  if (!mainWindow) return;
  
  isCollapsed = !isCollapsed;
  
  if (isCollapsed) {
    // 收缩到右侧
    mainWindow.setSize(50, mainWindow.getSize()[1]);
    mainWindow.setPosition(screen.getPrimaryDisplay().workAreaSize.width - 50, 0);
  } else {
    // 展开
    mainWindow.setSize(320, mainWindow.getSize()[1]);
    mainWindow.setPosition(screen.getPrimaryDisplay().workAreaSize.width - 320, 0);
  }
  
  return isCollapsed;
});

ipcMain.handle('get-window-state', () => {
  return isCollapsed;
});

// 退出应用
ipcMain.handle('quit-app', () => {
  isQuiting = true;
  app.quit();
}); 