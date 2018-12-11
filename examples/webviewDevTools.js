
  const {app, BrowserWindow, BrowserView} = require('electron');

  function _initDevTools() {
    let browserWin = new BrowserWindow({width: 800, height: 600});

    // browserWin.loadURL('https://electronjs.org');

    let view = new BrowserView({
      webPreferences: {
        nodeIntegration: false
      }
    });
    browserWin.setBrowserView(view)
    view.setBounds({ x: 0, y: 0, width: 400, height: 600 });
    view.webContents.loadURL('https://electronjs.org');


    let devtoolsView = new BrowserView({
      webPreferences: {
        nodeIntegration: false
      }
    });
    browserWin.setBrowserView(devtoolsView)
    devtoolsView.setBounds({ x: 400, y: 0, width: 400, height: 600 });


    view.webContents.setDevToolsWebContents(devtoolsView.webContents)

    // Open the DevTools.
    view.webContents.openDevTools({mode: 'detach'});
  }


  module.exports = function initDevTools(params={}) {
    _initDevTools(params);
  }
