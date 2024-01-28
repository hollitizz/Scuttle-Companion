import { app, BrowserWindow, ipcMain, shell, globalShortcut } from 'electron';
import path from 'path';
import { release } from 'node:os';
// import { autoUpdater } from 'electron-updater';

process.env.ROOT = path.join(__dirname, '..');
process.env.DIST = path.join(process.env.ROOT, 'dist-electron');
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
    ? path.join(process.env.ROOT, 'public')
    : path.join(process.env.ROOT, '.output/public');
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

if (release().startsWith('6.1')) app.disableHardwareAcceleration();
// if (process.platform === 'win32') app.setAppUserModelId(app.getName());

let win: BrowserWindow | null = null;
const preload = path.join(process.env.DIST, 'preload.js');

function appListeners() {
    if (process.platform === 'win32') {
        app.setAppUserModelId('com.electron.vite-react-ts');
    }

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        const allWindows = BrowserWindow.getAllWindows();
        if (allWindows.length) {
            allWindows[0].focus();
        } else {
            createWindow();
        }
    });

    app.on(
        'certificate-error',
        (event, webContents, url, error, certificate, callback) => {
            // On certificate error we disable default behaviour (stop loading the page)
            // and we then say "it is all fine - true" to the callback
            event.preventDefault();
            callback(true);
        }
    );

    app.on('window-all-closed', () => {
        win = null;
        if (process.platform !== 'darwin') app.quit();
    });

    app.on('second-instance', () => {
        if (win) {
            // Focus on the main window if the user tried to open another
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });
}

function clientListeners() {
    ipcMain.on('close', () => {
        if (!win) return;
        win.close();
    });

    ipcMain.on('minimize', () => {
        if (!win) return;
        win.minimize();
    });

    ipcMain.on('maximize', () => {
        if (!win) return;
        if (win.isMaximized()) {
            win.unmaximize();
        } else {
            win.maximize();
        }
    });
}

function winListeners() {
    if (!win) return;
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send(
            'main-process-message',
            new Date().toLocaleString()
        );
    });

    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url);
        return { action: 'deny' };
    });
}

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
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
}

function bootstrap() {
    createWindow();
    winListeners();
    clientListeners();
    appListeners();
}

app.whenReady()
    .then(bootstrap)
    .then(() => {
        if (!process.env.VITE_DEV_SERVER_URL) {
            // globalShortcut.register('F12', () => {});
            // globalShortcut.register('CommandOrControl+R', () => {});
            // globalShortcut.register('CommandOrControl+Shift+R', () => {});
            // globalShortcut.register('Alt+CommandOrControl+I', () => {});
            // globalShortcut.register('CommandOrControl+Shift+I', () => {});
            // autoUpdater.checkForUpdatesAndNotify();
        } else {
            globalShortcut.register('F12', () => {
                win?.webContents.toggleDevTools();
            });
            globalShortcut.register('F5', () => {
                win?.webContents.reload();
            });
        }
    });
