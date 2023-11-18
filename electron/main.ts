import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js
// │ ├─┬ preload
// │ │ └── index.js
// │ ├─┬ renderer
// │ │ └── index.html

process.env.ROOT = path.join(__dirname, '..');
process.env.DIST = path.join(process.env.ROOT, 'dist-electron');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.ROOT, 'public')
    : path.join(process.env.ROOT, '.output/public');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

let win: BrowserWindow;
const preload = path.join(process.env.DIST, 'preload.js');

function appListener() {
    if (process.platform === 'win32') {
        app.setAppUserModelId('com.electron.vite-react-ts');
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            bootstrap();
        }
    });
}

function clientListeners() {
    ipcMain.on('close', () => {
        win.close();
    });

    ipcMain.on('minimize', () => {
        win.minimize();
    });

    ipcMain.on('maximize', () => {
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });
}

function bootstrap() {
    win = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegrationInWorker: true,
            contextIsolation: false,
            nodeIntegration: true,
            webSecurity: false
        },
        minWidth: 800,
        minHeight: 600,
        width: 1024,
        height: 768,
        backgroundColor: '#1c5877',

        icon: path.join('assets/favicon.ico'),
        frame: false
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
        win.webContents.openDevTools();
    } else {
        win.loadFile(path.join(process.env.VITE_PUBLIC!, 'index.html'));
    }

    clientListeners();
    appListener();
}

app.whenReady().then(bootstrap);
