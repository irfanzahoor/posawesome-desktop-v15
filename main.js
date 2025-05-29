const { app, BrowserWindow, dialog, screen, Tray, Menu } = require('electron');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const http = require('http');
const AutoLaunch = require('auto-launch');

let mainWindow;
let tray;
let benchProcess;
let benchCrashed = false;
const CONFIG_FILE = path.join(app.getPath('userData'), 'config.json');

// Auto-launch setup
const launcher = new AutoLaunch({
  name: 'POS Desktop App',
  path: app.getPath('exe')
});

launcher.enable();

function getBenchPath() {
  if (fs.existsSync(CONFIG_FILE)) {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
    return config.benchPath;
  } else {
    const selectedPaths = dialog.showOpenDialogSync({
      title: 'Select frappe-bench folder',
      properties: ['openDirectory']
    });

    if (selectedPaths && selectedPaths[0]) {
      const benchPath = selectedPaths[0];
      fs.writeFileSync(CONFIG_FILE, JSON.stringify({ benchPath }));
      return benchPath;
    } else {
      app.quit();
    }
  }
}

function startFrappeBench(benchPath) {
  benchProcess = exec('bench start', { cwd: benchPath });

  benchProcess.stdout.on('data', data => {
    console.log('[Bench STDOUT]', data.toString());
  });

  benchProcess.stderr.on('data', data => {
    console.error('[Bench STDERR]', data.toString());
  });

  benchProcess.on('exit', code => {
    console.log(`[Bench process exited with code ${code}]`);
    benchCrashed = true;
  });

  benchProcess.on('error', err => {
    console.error('[Bench ERROR]', err);
    benchCrashed = true;
    dialog.showErrorBox('Bench Error', `Failed to start Frappe Bench: ${err.message}`);
    app.quit();
  });
}

function waitForFrappeReady(url, callback, timeout = 30000) {
  const startTime = Date.now();

  const check = () => {
    http.get(url, res => {
      if (res.statusCode === 200) {
        console.log('[Frappe Ready]');
        return callback();
      } else {
        retry();
      }
    }).on('error', () => {
      retry();
    });
  };

  const retry = () => {
    if (Date.now() - startTime > timeout) {
      if (benchCrashed) {
        dialog.showErrorBox('Bench Stopped', 'Frappe Bench exited unexpectedly.');
      } else {
        dialog.showErrorBox('Timeout', 'Frappe Bench did not start in time.');
      }
      app.quit();
    } else {
      setTimeout(check, 1000);
    }
  };

  check();
}

function createWindow() {
  if (mainWindow) {
    mainWindow.show();
    return;
  }

  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width,
    height,
    fullscreen: false,
    show: false,
    icon:path.join(__dirname, 'icons', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadURL('http://127.0.0.1:8001/app/posapp');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('minimize', event => {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createTray();
}

function createTray() {
  if (tray) return;

  tray = new Tray(path.join(__dirname, 'icons/icon.png'));

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show App', click: () => mainWindow?.show() },
    { label: 'Quit', click: () => app.quit() },
    { type: 'separator' },
    {
      label: 'About',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'About POS Desktop App',
          message: 'POS Desktop App v1.0.0\nBuilt with Electron and Frappe.',
          buttons: ['OK']
        });
      }
    },
    { type: 'separator' },
    {
      label: 'Check for Updates',
      click: () => {
        dialog.showMessageBox({
          type: 'info',
          title: 'Check for Updates',
          message: 'No updates available at this time.',
          buttons: ['OK']
        });
      }
    },
    { type: 'separator' },
    { label: 'Exit', click: () => app.quit() }
  ]);

  tray.setToolTip('POS Desktop App');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow?.show();
  });
}

app.whenReady().then(() => {
  const benchPath = getBenchPath();
  Menu.setApplicationMenu(null);

  startFrappeBench(benchPath);
  waitForFrappeReady('http://127.0.0.1:8001', createWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
});
