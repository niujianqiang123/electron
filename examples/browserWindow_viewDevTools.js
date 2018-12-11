const {app, BrowserWindow, BrowserView} = require('electron');

function _initDevTools() {
  let browserWin = new BrowserWindow({width: 600, height: 400});
  let devtoolsWin = new BrowserWindow({width: 600, height: 400});

  // browserWin.loadURL('https://electronjs.org');

  let view = new BrowserView({
    webPreferences: {
      nodeIntegration: false
    }
  })
  browserWin.setBrowserView(view)
  view.setBounds({x: 0, y: 0, width: 400, height: 400});
  view.webContents.loadURL('https://electronjs.org');

  view.webContents.setDevToolsWebContents(devtoolsWin.webContents)

// Open the DevTools.
  view.webContents.openDevTools({mode: 'detach'});
}


module.exports = function initDevTools(params = {}) {
  _initDevTools(params);
}

