/**
 * Created by xiaogang on 2018/12/3.
 * 主线程
 */
"use strict";

//base
const path = require('path');
const {app, ipcMain, BrowserWindow, BrowserView, dialog} = require('electron');

//modules
const {common} = require('../../config/index');
const RenderWindow = require('../render/render');

//pages
// const PageUrl = 'https://wx.qq.com/?lang=zh_CN';
const PageUrl = `file://${path.join(__dirname, './home.html')}`; // 默认相对于根目录
// const PageUrl = `file://${path.join(__dirname, '../render/render.html')}`; // 默认相对于根目录

class Home {
  constructor(params) {
    this.isShow = false;
    this.homeWin = null;
    this.renderView = null;
    this.renderUrl = '';//https://electronjs.org

    this.createWindow();
    this.renderEvents();
  }

  createWindow() {
    this.homeWin = new BrowserWindow({
      title: common.name,
      resizable: true,
      center: true,
      show: false,
      frame: true,
      autoHideMenuBar: true,
      width: common.window_size.width,
      minWidth: common.window_size.minWidth,
      height: common.window_size.height,
      webPreferences: {
        javascript: true,
        webSecurity: false,
      }
    });

    this.homeWin.loadURL(PageUrl);
    // this.homeWin.loadFile(PageFile);

    this.createRenderView();

    //openDevTools
    // this.homeWin.openDevTools();

  }

  createRenderView() {
    this.renderView = new RenderWindow(this.renderUrl);
    this.renderView.win.setBounds({x: 10, y: 50, width: 800, height: 600});
    this.homeWin.setBrowserView(this.renderView.win);

    if (!this.renderView.isShow) {
      this.renderView.show();
    }
  }


  renderEvents() {
    ipcMain.on('toggle-home-devTools', (event, arg) => {
      if (this.homeWin.webContents.isDevToolsOpened()) {
        this.homeWin.closeDevTools();
      } else {
        this.homeWin.openDevTools();
      }

    })
  }

  show() {
    this.homeWin.show();
    this.homeWin.focus();
    this.isShow = true;
  }
}

module.exports = Home;
