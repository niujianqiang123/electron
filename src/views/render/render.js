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
const PageFile = `${path.join(__dirname, './render.html')}`; // 默认相对于根目录


class Render {
  constructor(params = {}) {
    if (typeof params) {
      params = {pageUrl: params};
    }

    this.pageUrl = params.pageUrl;

    this.isShow = false;

    this.win = null;
    this.createWindow();
  }

  createWindow() {
    this.win = new BrowserView({
      title: common.name,
      resizable: true,
      center: true,
      show: true,
      frame: true,
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

    this.isShow = true;


    if (this.pageUrl) {
      this.win.webContents.loadURL(this.pageUrl);
    } else {
      this.win.webContents.loadFile(PageFile);
    }
    this.win.webContents.openDevTools()
  }

  show() {
    this.win.show();
    this.win.focus();
    this.isShow = true;
  }
}

module.exports = Render;
