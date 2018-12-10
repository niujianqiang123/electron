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
    this.renderUrl = '';//default url https://electronjs.org
    this.contentBounds = {
      headerHeight: 100,//顶部默认高度
      renderWidth: 400,//渲染区默认宽度
    }

    this.createWindow();
    this.ipcEvents();
    this.instanceEvents();
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
    // this.toggleDevTools();

  }

  toggleDevTools() {
    this.homeWin.toggleDevTools();
  };


  /**
   * 创建render 子窗口（webView）
   * todo: （暂时不考虑 多层 webView 的封装抽离）
   * 1、webView 内 require('electron') 报require error。API有限制
   * 2、webView 嵌套渲染 webView（for render box）& webview (for devTools box)时 renderView.getWebContents() 报错：undefined is not a function 即：API有限制
   */
  createRenderWindow() {
    this.renderWin = new RenderWindow({
      pageUrl: this.renderUrl,
      parentWin: this.homeWin,
      bounds: this.getContentBounds().render,
    });

    if (!this.renderWin.isShow) {
      this.renderWin.show();
    }

    this.setDevToolsWebContents();
  }

  createDevToolsWindow() {
    this.devToolsWin = new DevToolsWindow({
      parentWin: this.homeWin,
      bounds: this.getContentBounds().devTools
    });

    if (!this.devToolsWin.isShow) {
      this.devToolsWin.show();
    }
  }

  setDevToolsWebContents() {
    this.renderWin.setDevToolsWebContents(this.devToolsWin.win.webContents);
  }

  /**
   * init or move or resize 的时候获取最新的 内容边界值
   */
  getContentBounds() {
    let _rectangle = this.homeWin.getContentBounds();

    return {
      render: {
        x: _rectangle.x,
        y: _rectangle.y + this.contentBounds.headerHeight,
        width: this.contentBounds.renderWidth,
        height: _rectangle.height - this.contentBounds.headerHeight
      },
      devTools: {
        x: _rectangle.x + this.contentBounds.renderWidth,
        y: _rectangle.y + this.contentBounds.headerHeight,
        width: _rectangle.width - this.contentBounds.renderWidth,
        height: _rectangle.height - this.contentBounds.headerHeight
      }
    };
  }

  /**
   * 线程间 通信
   */
  ipcEvents() {
    ipcMain.on('toggle-home-devTools', (event, arg) => {
      this.homeWin.toggleDevTools();
    });
    ipcMain.on('home-updateRenderUrl', (event, _inputValue) => {
      // console.log(event);
      this.renderUrl = _inputValue;

      this.updateRenderUrl();
    });


  }

  /**
   * 实例事件
   */
  instanceEvents() {
    /**
     * todo: 加入去抖动函数
     * tips:打开任务管理器，移动时: cpu 占用瞬间飙升
     */
    this.homeWin.on('move', (e) => {
      let _newContentBounds = this.getContentBounds();
      this.renderWin.setBounds(_newContentBounds.render);
      this.devToolsWin.setBounds(_newContentBounds.devTools);
    });

    /**
     * todo: 加入去抖动函数
     * tips:打开任务管理器，移动时: cpu 占用瞬间飙升
     */
    this.homeWin.on('resize', (e) => {
      let _newContentBounds = this.getContentBounds();
      this.renderWin.setBounds(_newContentBounds.render);
      this.devToolsWin.setBounds(_newContentBounds.devTools);
    });
  }


  updateRenderUrl() {
    // this.renderUrl && this.homeWin.send('home-updateRenderUrl', this.renderUrl);
    this.renderUrl && this.renderWin.loadUrl(this.renderUrl);
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

      // this.updateRenderUrl();
    });
  }
}

module.exports = Home;
