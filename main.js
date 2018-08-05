'use strict'

const electron = require('electron')
const app = electron.app
const globalShortcut = electron.globalShortcut
const os = require('os')
const path = require('path')
const config = require(path.join(__dirname, 'package.json'))
const BrowserWindow = electron.BrowserWindow
const globalConfig = require(path.join(__dirname, 'config.json'))
const settings = require('electron-settings');

settings.set('connectionSettings', { connection: '127.0.0.1' });
settings.get('connectionSettings.connection');

app.setName(config.productName)

var fs = require('fs');
var AES = require("crypto-js/aes");
var SHA256 = require("crypto-js/sha256");
let multichain = require("multichain-node")({
    port: globalConfig.connection.port,
    host: globalConfig.connection.host,
    user: globalConfig.connection.user,
    pass: globalConfig.connection.pass,
});

multichain.getInfo((err, info) => {
    if(err){
        throw err;
    }
    JSON.stringify(info);
    console.log(info);
    global.x = (info);
});

var mainWindow = null
app.on('ready', function () {
  mainWindow = new BrowserWindow({
    title: config.productName,
    backgroundColor: '#333333',
    webPreferences: {
      nodeIntegration: true,
      defaultEncoding: 'UTF-8'
    }
  })

  mainWindow.loadURL(`file://${__dirname}/app/index.html`)
  var introJS = require('intro.js').introJs
  console.log(SHA256("Message"));
  // Enable keyboard shortcuts for Developer Tools on various platforms.
  let platform = os.platform()
  if (platform === 'darwin') {
    globalShortcut.register('Command+Option+I', () => {
      mainWindow.webContents.openDevTools()
    })
  } else if (platform === 'linux' || platform === 'win32') {
    globalShortcut.register('Control+Shift+I', () => {
      mainWindow.webContents.openDevTools()
    })
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.setMenu(null)
    mainWindow.show()
  })

  mainWindow.onbeforeunload = (e) => {
    // Prevent Command-R from unloading the window contents.
    e.returnValue = false
  }

  mainWindow.on('closed', function () {
    mainWindow = null
  })
})

app.on('window-all-closed', () => { app.quit() })
