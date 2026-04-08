import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log' 
import { createWindow } from './helpers'

const isProd = process.env.NODE_ENV === 'production'
autoUpdater.logger = log
log.transports.file.level = "info"

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  
  autoUpdater.autoDownload = false

  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('update-status', 'checking')
  })

  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('update-status', 'downloading')
    autoUpdater.downloadUpdate()
  })

  autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send('update-progress', progressObj.percent)
  })

  autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('update-status', 'ready')
    mainWindow.webContents.send('update-version', info.version)
  })

  autoUpdater.on('error', () => {
    mainWindow.webContents.send('update-status', 'error')
  })

  ipcMain.on('check-update', () => {
    if (isProd) autoUpdater.checkForUpdates()
  })

  ipcMain.on('restart-app', () => {
    autoUpdater.quitAndInstall()
  })

  if (isProd) {
    await mainWindow.loadURL('app://./home')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on('window-all-closed', () => {
  app.quit()
})