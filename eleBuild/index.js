const { app, BrowserWindow, Menu } = require("electron")
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600
  })

  win.webContents.openDevTools()
  win.loadURL(`file://${__dirname}/dist/index.html`)
  Menu.setApplicationMenu(null)
}
app.whenReady().then(() => {
  createWindow()
})

