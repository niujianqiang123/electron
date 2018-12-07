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

class Home {
  constructor(params) {
    this.isShow = false;
    this.homeWin = null;
    this.renderView = null;
    this.renderUrl = 'https://electronjs.org';//https://electronjs.org

    this.createWindow();
    this.renderEvents();
    this.updateRenderUrl();
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
      minHeight: common.window_size.minHeight,
      webPreferences: {
        javascript: true,
        webSecurity: false,
      }
    });

    this.homeWin.loadURL(PageUrl);
    // this.homeWin.loadFile(PageFile);

    // this.createRenderView();

    //openDevTools
    // this.homeWin.openDevTools();

  }

  /**
   * 创建render 子窗口（webView）
   * todo: （暂时不考虑 多层 webView 的封装抽离）
   * 1、webView 内 require('electron') 报require error。API有限制
   * 2、webView 嵌套渲染 webView（for render box）& webview (for devTools box)时 renderView.getWebContents() 报错：undefined is not a function 即：API有限制
   */
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
      this.homeWin.toggleDevTools();

      // if (this.homeWin.webContents.isDevToolsOpened()) {
      //   this.homeWin.closeDevTools();
      // } else {
      //   this.homeWin.openDevTools();
      // }

    });
    ipcMain.on('home-renderPageUrl', (event, _inputValue) => {
      // console.log(event);
      this.renderUrl = _inputValue;

      this.updateRenderUrl();
    });

  }

  updateRenderUrl(){
    this.renderUrl && this.homeWin.send('home-renderPageUrl', this.renderUrl);
  }

  show() {
    this.homeWin.show();
    this.homeWin.focus();
    this.isShow = true;
  }
}

module.exports = Home;
