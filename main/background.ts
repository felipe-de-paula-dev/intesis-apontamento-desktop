import path from 'path'
import { app, ipcMain } from 'electron'
import serve from 'electron-serve'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log' 
import { createWindow } from './helpers'
import * as dotenv from 'dotenv'

dotenv.config()

const isProd = process.env.NODE_ENV === 'production'

autoUpdater.logger = log
log.transports.file.level = "info"

autoUpdater.requestHeaders = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
}

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}


if (!isProd) {
  autoUpdater.forceDevUpdateConfig = true
}

;(async () => {
  await app.whenReady()
  
  const mainWindow = createWindow('main', {
      width: 1000,
      height: 600,
      webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  autoUpdater.autoDownload = false

  // Configurar os listeners ANTES de carregar a página
  autoUpdater.on('checking-for-update', () => {
    console.log('🔍 Verificando se há atualizações...')
    mainWindow.webContents.send('update-status', 'checking')
  })

  autoUpdater.on('update-available', (info) => {
    console.log('✅ Atualização encontrada:', info.version)
    mainWindow.webContents.send('update-status', 'downloading')
    autoUpdater.downloadUpdate()
  })

  autoUpdater.on('update-not-available', (info) => {
    console.log('ℹ️ Nenhuma atualização disponível.')
    setTimeout(() => {
      mainWindow.loadURL(isProd ? 'app://./splash' : `http://localhost:${process.argv[2]}/splash`)
    }, 2000)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    console.log(`📥 Progresso: ${progressObj.percent.toFixed(2)}%`)
    mainWindow.webContents.send('update-progress', progressObj.percent)
  })

  autoUpdater.on('update-downloaded', (info) => {
    console.log('🏁 Download concluído. Versão:', info.version)
    mainWindow.webContents.send('update-status', 'ready')
    mainWindow.webContents.send('update-version', info.version)
  })

  autoUpdater.on('error', (err) => {
    console.error('❌ Erro no AutoUpdater:', err.message);
    
    mainWindow.webContents.send('update-status', 'error');

    setTimeout(() => {
      const port = process.argv[2];
      const homeUrl = isProd 
        ? 'app://./splash' 
        : `http://localhost:${port}/splash`;
      
      console.log('Indo para a Home devido a erro no updater...');
      mainWindow.loadURL(homeUrl);
    }, 3000);
  });

  ipcMain.on('check-update', () => {
    console.log('🚀 Iniciando busca manual...')
    autoUpdater.checkForUpdates().catch(err => {
      console.error('Erro ao chamar checkForUpdates:', err)
      mainWindow.webContents.send('update-status', 'error')
    })
  })

  ipcMain.on('restart-app', () => {
    autoUpdater.quitAndInstall()
  })

  // Carregar a página de update primeiro
  if (isProd) {
    await mainWindow.loadURL('app://./updatescreen')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/updatescreen`)
    mainWindow.webContents.openDevTools()
  }

})()

app.on('window-all-closed', () => {
  app.quit()
})