/**
 * Created by xiaogang on 2018/12/7.
 *
 */
"use strict";
const path = require('path');
const {app, ipcMain, BrowserWindow, BrowserView} = require('electron');

//modules
const {common} = require('../../config/index');


//pages
const pageUrl = `file://${path.join(__dirname, './devTools.html')}`; // 默认相对于根目录


class DevTools {
  constructor(params = {}) {
    this.parentWin = params.parentWin || null;
    this.isShow = true;
    this.bounds = params.bounds;
    this.win = null;
    this.createWindow();
  }

  createWindow() {
    this.win = new BrowserWindow({
      title: "devtool",
      parent: this.parentWin,
      resizable: false,
      center: false,
      show: true,
      frame: false,
      autoHideMenuBar: true,
      width: common.window_render_size.width,
      minWidth: common.window_render_size.minWidth,
      height: common.window_render_size.height,
      webPreferences: {
        javascript: true,
        nodeIntegration: false,
        webSecurity: false,
      }
    });

  }

  /**
   * 根据父窗口调整位置
   */
  setBounds(bounds = this.bounds) {
    this.win.setBounds(bounds);
  }

  show() {
    this.win.show();
    this.win.focus();
    this.isShow = true;
  }
}

module.exports = DevTools;
