/**
 * Created by xiaogang on 2018/12/4.
 *
 */
"use strict";
const path = require('path');
const {app, ipcMain, BrowserWindow, BrowserView} = require('electron');

//modules
const {common} = require('../../config/index');
const {htmlScroll} = require('./injectCss');

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
    this.renderMargin = {
      x: 20,
      y: 50
    };
    this.isShow = false;

    this.win = null;
    this.createWindow();
    this.instanceEvents();
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
    this.preFixStyle();
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
  setBounds(bounds = this.bounds, margin = this.renderMargin) {
    let _bounds = {
      x: bounds.x + margin.x,
      y: bounds.y + margin.y,
      width: bounds.width - 2 * margin.x,
      height: bounds.height - 1.5 * margin.y
    }
    this.win.setBounds(_bounds);
  }

  preFixStyle() {
    this.win.webContents.insertCSS(htmlScroll);

  }

  /**
   * 实例事件
   */
  instanceEvents() {
    this.win.webContents.on('dom-ready', (e) => {
      this.preFixStyle();
    });
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
