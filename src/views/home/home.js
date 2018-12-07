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
const DevToolsWindow = require('../devtools/devTools');

//pages
// const PageUrl = 'https://wx.qq.com/?lang=zh_CN';
const PageUrl = `file://${path.join(__dirname, './home.html')}`; // 默认相对于根目录

class Home {
  constructor(params) {
    this.isShow = false;
    this.homeWin = null;
    this.renderWin = null;
    this.devToolsWin = null;
    this.renderUrl = 'https://electronjs.org';//default url

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
      width: common.window_size.width,
      minWidth: common.window_size.minWidth,
      height: common.window_size.height,
      minHeight: common.window_size.minHeight,
      webPreferences: {
        javascript: true,
        webSecurity: false,
      }
    });

    this.homeWin.loadURL(PageUrl);

    this.createDevToolsWindow();
    this.createRenderWindow();

    //openDevTools
    // this.homeWin.openDevTools();

  }

  /**
   * 创建render 子窗口（webView）
   * todo: （暂时不考虑 多层 webView 的封装抽离）
   * 1、webView 内 require('electron') 报require error。API有限制
   * 2、webView 嵌套渲染 webView（for render box）& webview (for devTools box)时 renderView.getWebContents() 报错：undefined is not a function 即：API有限制
   */
  createRenderWindow() {
    this.renderWin = new RenderWindow({pageUrl: this.renderUrl});

    if (!this.renderWin.isShow) {
      this.renderWin.show();
    }

    this.setDevToolsWebContents();
  }

  createDevToolsWindow() {
    this.devToolsWin = new DevToolsWindow();

    if (!this.devToolsWin.isShow) {
      this.devToolsWin.show();
    }
  }

  setDevToolsWebContents() {
    this.renderWin.setDevToolsWebContents(this.devToolsWin.win.webContents);
  }

  renderEvents() {
    ipcMain.on('toggle-home-devTools', (event, arg) => {
      this.homeWin.toggleDevTools();


    });
    ipcMain.on('home-updateRenderUrl', (event, _inputValue) => {
      // console.log(event);
      this.renderUrl = _inputValue;

      this.updateRenderUrl();
    });

  }

  updateRenderUrl() {
    this.renderUrl && this.homeWin.send('home-updateRenderUrl', this.renderUrl);
  }

  /**
   * 主窗口实例显示
   */
  show() {
    //
    this.homeWin.once('ready-to-show', () => {
      this.homeWin.show();
      this.homeWin.focus();
      this.isShow = true;

      this.updateRenderUrl();
    });
  }
}

module.exports = Home;
