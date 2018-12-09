/**
 * Created by xiaogang on 2018/12/4.
 *
 */
"use strict";
const path = require('path');
const {app, ipcMain, BrowserWindow, BrowserView} = require('electron');

//modules
const {common} = require('../../config/index');


//pages
const pageUrl = `file://${path.join(__dirname, './render.html')}`; // 默认相对于根目录


class Render {
  constructor(params = {}) {
    if (typeof params === 'string') {
      params = {pageUrl: params};
    }
    console.log(params);
    this.parentWin = params.parentWin || null;

    this.pageUrl = params.pageUrl || pageUrl;
    this.bounds = params.bounds;
    this.isShow = false;

    this.win = null;
    this.createWindow();
  }

  createWindow() {
    this.win = new BrowserWindow({
      title: "render",
      parent: this.parentWin,
      resizable: false,
      center: false,
      show: false,
      frame: false,
      autoHideMenuBar: true,
      // width: common.window_render_size.width,
      // minWidth: common.window_render_size.minWidth,
      // height: common.window_render_size.height,
      webPreferences: {
        javascript: true,
        nodeIntegration: false,
        webSecurity: false,
      }
    });

    // this.win.webContents.loadURL(this.pageUrl || pageUrl);
    this.loadUrl();
    this.setBounds();
    // this.win.webContents.openDevTools()
  }

  loadUrl(pUrl = this.pageUrl) {
    this.win.loadURL(pUrl);
  }

  setDevToolsWebContents(webContents) {
    this.win.webContents.setDevToolsWebContents(webContents)

    // Open the DevTools.
    this.win.webContents.openDevTools({mode: 'detach'})
  }

  /**
   * 根据父窗口调整位置
   */
  setBounds(bounds = this.bounds) {
    this.win.setBounds(bounds);
  }

  show() {
    this.win.once('ready-to-show', () => {
      this.win.show();
      this.win.focus();
      this.isShow = true;
    });
  }
}

module.exports = Render;
