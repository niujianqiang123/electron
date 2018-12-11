const {app, BrowserWindow, BrowserView} = require('electron');

function _browserWinDevTools() {
  let browserWin = new BrowserWindow({width: 600, height: 400});
  let devtoolsWin = new BrowserWindow({width: 600, height: 400});

  browserWin.loadURL('https://electronjs.org');

  browserWin.webContents.setDevToolsWebContents(devtoolsWin.webContents)

// Open the DevTools.
  browserWin.webContents.openDevTools({mode: 'detach'});
}


module.exports = function browserWindowDevTools(params={}) {
  _browserWinDevTools(params);
}

