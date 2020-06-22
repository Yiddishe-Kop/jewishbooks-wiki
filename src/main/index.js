import { app, BrowserWindow, ipcMain, globalShortcut, dialog } from 'electron'
// import store from '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 950,
    useContentSize: true,
    backgroundColor: '#e2e8f0',
    titleBarStyle: 'hiddenInset',
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function registerKeyboardShortcuts() {
  globalShortcut.register('CommandOrControl+Left', () => {
    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('window.history.back()');
  })
  globalShortcut.register('CommandOrControl+Right', () => {
    BrowserWindow.getFocusedWindow().webContents.executeJavaScript('window.history.forward()');
  })
  globalShortcut.register('CommandOrControl+F', () => {
    BrowserWindow.getFocusedWindow().webContents.executeJavaScript(`
      window.dispatchEvent(new Event('open-search'))
    `);
  })
}

// broadcast Vuex mutations
ipcMain.on('login', (event, user) => {
  BrowserWindow.getAllWindows().forEach(window => {
    window.webContents.send(
      'login',
      user
    );
  })
});

app.on('ready', () => {
  createWindow()
  registerKeyboardShortcuts()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  // sequelize.close()
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
