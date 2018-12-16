/**
 * Created by xiaogang on 2018/12/7.
 * todo: 私有属性 & 方法 改造！
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
    //私有属性
    this._parentWin = params.parentWin || null;
    this._bounds = params.bounds;
    //实例属性
    this.isShow = true;
    this.win = null;
    this._createWindow();
    this.setBounds();
  }

  _createWindow() {
    this.win = new BrowserWindow({
      title: "renderView devTool",
      parent: this._parentWin,
      resizable: false,
      center: false,
      show: this.isShow,
      frame: false,
      autoHideMenuBar: true,
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
  setBounds(bounds = this._bounds) {
    // console.log(`--------devTools--setBounds----------`);
    // console.log(bounds);
    this.win.setBounds(bounds);
  }

  close() {
    this._parentWin = null;
    this.win.destroy();
  }

  show() {
    this.win.show();
    this.win.focus();
    this.isShow = true;
  }
}

module.exports = DevTools;
