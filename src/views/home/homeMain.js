/**
 * Created by xiaogang on 2018/12/3.
 * 主线程
 */
"use strict";

//base
const path = require('path');
const {app, ipcMain, BrowserWindow, BrowserView, dialog} = require('electron');

//modules
const {common, winConfig} = require('../../config/index');
const RenderWindow = require('../render/renderMain');
const DevToolsWindow = require('../devtools/devToolsMain');

//pages
// const PageUrl = 'https://wx.qq.com/?lang=zh_CN';
const PageUrl = `file://${path.join(__dirname, './home.html')}`; // 默认相对于根目录

class Home {
  constructor(params = {}) {
    //私有属性
    this._renderWin = null;
    this._devToolsWin = null;
    this._renderUrl = params._renderUrl || '';//default url https://electronjs.org
    this._homeBounds = winConfig.home.bounds;

    this._renderBounds = winConfig.render.bounds;

    //实例属性
    this.isShow = params.isShow || false;
    this.homeWin = null;

    this._createWindow();
    this._ipcEvents();
    this._instanceEvents();
  }

  _createWindow() {
    this.homeWin = new BrowserWindow({
      title: common.name,
      resizable: true,
      center: true,
      show: false,
      frame: true,
      width: this._homeBounds.width,
      minWidth: this._homeBounds.minWidth,
      height: this._homeBounds.height,
      minHeight: this._homeBounds.minHeight,
      webPreferences: {
        javascript: true,
        webSecurity: false,
      }
    });

    this.homeWin.loadURL(PageUrl);

    this._createDevToolsWindow();
    this._createRenderWindow();
  }




  /**
   * 创建render 子窗口（webView）
   * todo: （暂时不考虑 多层 webView 的封装抽离）
   * 1、webView 内 require('electron') 报require error。API有限制
   * 2、webView 嵌套渲染 webView（for render box）& webview (for devTools box)时 renderView.getWebContents() 报错：undefined is not a function 即：API有限制
   */
  _createRenderWindow() {
    this._renderWin = new RenderWindow({
      pageUrl: this._renderUrl,
      parentWin: this.homeWin,
      bounds: this.getContentBounds().render,
    });

    if (!this._renderWin.isShow) {
      this._renderWin.show();
    }

    this._setDevToolsWebContents();
  }

  _createDevToolsWindow() {
    this._devToolsWin = new DevToolsWindow({
      parentWin: this.homeWin,
      bounds: this.getContentBounds().devTools
    });

    if (!this._devToolsWin.isShow) {
      this._devToolsWin.show();
    }
  }

  _setDevToolsWebContents() {
    this._renderWin.setDevToolsWebContents(this._devToolsWin.win.webContents);
  }

  /**
   * 线程间 通信
   */
  _ipcEvents() {
    ipcMain.on('home-toggle-devTools', (event, arg) => {
      this.homeWin.toggleDevTools();
    });
    ipcMain.on('home-updateRenderUrl', (event, _inputValue) => {
      this.updateRenderUrl(_inputValue);
    });

  }

  /**
   * 实例事件
   */
  _instanceEvents() {
    /**
     * todo: 加入去抖动函数
     * tips:打开任务管理器，移动时: cpu 占用瞬间飙升
     */
    this.homeWin.on('move', (e) => {
      let _newContentBounds = this.getContentBounds();
      this._renderWin.setBounds(_newContentBounds.render);
      this._devToolsWin.setBounds(_newContentBounds.devTools);
    });

    /**
     * todo: 加入去抖动函数
     * tips:打开任务管理器，移动时: cpu 占用瞬间飙升
     */
    this.homeWin.on('resize', (e) => {
      let _newContentBounds = this.getContentBounds();
      this._renderWin.setBounds(_newContentBounds.render);
      this._devToolsWin.setBounds(_newContentBounds.devTools);
    });
  }

  /**
   * 用户更新 selects 时
   * @param params={
   *    @Integer width
   *    @Integer height
   *    @Number percent
   *    @Integer marginX
   *    @Integer marginTop
   * }
   */
  updateRenderBounds(params = {}) {
    this._renderBounds = params
  }

  /**
   * init or move or resize 的时候获取最新的 内容边界值
   */
  getContentBounds() {
    let _rectangle = this.homeWin.getContentBounds();

    return {
      render: {
        x: _rectangle.x,
        y: _rectangle.y + this._homeBounds.headerHeight,
        width: this._renderBounds.width,
        height: _rectangle.height - this._homeBounds.headerHeight
      },
      devTools: {
        x: _rectangle.x + this._renderBounds.width,
        y: _rectangle.y + this._homeBounds.headerHeight,
        width: _rectangle.width - this._renderBounds.width,
        height: _rectangle.height - this._homeBounds.headerHeight
      }
    };
  }

  toggleDevTools() {
    this.homeWin.toggleDevTools();
  };

  /**
   *
   * @param renderUrl
   */
  updateRenderUrl(renderUrl = this._renderUrl) {
    this._renderUrl = renderUrl;
    renderUrl && this._renderWin.loadUrl(this._renderUrl);
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
    });
  }
}

module.exports = Home;
