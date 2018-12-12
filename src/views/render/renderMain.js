/**
 * Created by xiaogang on 2018/12/4.
 *
 */
"use strict";
const path = require('path');
const {app, ipcMain, BrowserWindow, BrowserView} = require('electron');

//modules
const {winConfig} = require('../../config/index');
const {htmlScroll} = require('./injectCss');

//pages
const pageUrl = `file://${path.join(__dirname, './render.html')}`; // 默认相对于根目录
const viewUrl = `file://${path.join(__dirname, './view.html')}`; // 默认相对于根目录


class Render {
  constructor(params = {}) {
    console.log(`--new Render constructor--`);
    console.log(params);
    //私有属性
    this._parentWin = params.parentWin || null;
    this._title = params.title || 'render view';
    //模拟器 渲染区 窗口
    this._renderView = null;
    this._viewUrl = params._viewUrl || params.pageUrl || viewUrl;
    this._deviceEmulation = winConfig.render.deviceEmulation;
    // this.renderConfig = params.renderConfig || winConfig.render;
    //跟随主窗口 没法设置默认值
    this._bounds = Object.assign(winConfig.render.bounds, params.bounds);
    //实例属性
    this.isShow = params.show || false;
    //子窗口
    this.win = null;


    this._createWindow();
    this._createRenderView();
    this._instanceEvents();
    this._ipcEvents();
  }

  /**
   *
   */
  _createWindow() {
    this.win = new BrowserWindow({
      _title: this._title,
      parent: this._parentWin,
      resizable: false,
      center: false,
      show: this.isShow,
      frame: false,
      autoHideMenuBar: true,
      webPreferences: {
        javascript: true,
        webSecurity: false,
      }
    });

    this.win.loadURL(pageUrl);
    this.setBounds();
    this.win.webContents.openDevTools({
      mode: 'detach'
    })
  }

  /**
   * for deviceEmulation render
   */
  _createRenderView(params = {}) {
    this._renderView = new BrowserView(params);
    this._setBrowserView();
    this._setRenderViewBounds();
    this.loadUrl(this._viewUrl, {forceLoad: true});
  }

  _setBrowserView() {
    if (this.win) {
      this.win.setBrowserView(this._renderView)
    }
  }




  /**
   * https://github.com/electron/electron/issues/4099
   * You should call enableDeviceEmulation after the page gets loaded.
   * @param webContents
   * @param params
   */
  _enableDeviceEmulation(webContents = this._renderView.webContents, params = this._deviceEmulation) {
    console.log(params);
    webContents.enableDeviceEmulation(params)
  }


  /**
   *
   * @param bounds
   */
  _updateBound(bounds) {
    this._bounds = bounds;
  }

  /**
   * 设置 渲染区 位置
   */
  _setRenderViewBounds(bounds = this._bounds) {
    console.log(bounds)
    this._renderView.setBounds({
      x: bounds.marginX,
      y: bounds.marginY + bounds.menuHeight,
      width: 375,
      height: 667
    })
  }



  /**
   * todo:
   * 更新 & 重新渲染
   */
  _optionsChange(options = {}, margin = {}) {
    console.log(options);
    console.log(margin);

    //todo 根据options 调整 margin
    // this.renderConfig.margin
    //更新 配置数据
    if (options.percent) {
      // this.renderConfig.bounds.percent = options.percent;

    }

    if (options.dpr) {
      // this.renderConfig.deviceEmulation.deviceScaleFactor = Math.floor(options.dpr)
    }

    if (options.width && options.height) {

      // this.renderConfig.bounds.width = options.width + this.renderConfig.margin.x;
      //
      // this.renderConfig.deviceEmulation.viewSize.width = this.renderConfig.deviceEmulation.screenSize.width = Math.floor(options.width);
      // this.renderConfig.deviceEmulation.viewSize.height = this.renderConfig.deviceEmulation.screenSize.height = Math.floor(options.height);
    }

  }

  _preFixStyle() {
    // this.win.webContents.insertCSS(htmlScroll);

  }

  /**
   * 实例事件
   */
  _instanceEvents() {
    this.win.webContents.on('dom-ready', (e) => {
      this._preFixStyle();
    });

    this.win.webContents.on('did-finish-load', (e) => {
      this._enableDeviceEmulation(this.win.webContents, {
        screenPosition: 'mobile',
        //屏幕 尺寸 & 同步 exports.render.screenSize
        screenSize: {
          width: this._bounds.width,
          height: this._bounds.height
        }
      });
    });
    //todo : win 平台 没有自带事件
    this.win.webContents.on('scroll', (e) => {
      console.log(e);
    });
    this._renderView.webContents.on('did-finish-load', (e) => {
      this._enableDeviceEmulation(this._renderView.webContents);
    });
  }

  /**
   * 线程间 通信
   */
  _ipcEvents() {
    ipcMain.on('render-select-options', (event, options) => {
      this._optionsChange(options);
    });
  }

  /**
   * 开启 devTools
   * @param webContents
   */
  setDevToolsWebContents(webContents) {
    this._renderView.webContents.setDevToolsWebContents(webContents)

    // Open the DevTools.
    this._renderView.webContents.openDevTools({mode: 'detach'})
  }

  /**
   * 根据父窗口调整位置
   *
   */
  setBounds(bounds = this._bounds) {
    // console.log(`--------render--setBounds----------`);
    // console.log(bounds);
    //保存数据 & 同时更新渲染
    this.win.setBounds(bounds, true);
    this._updateBound(bounds);
  }

  /**
   *  https://electronjs.org/docs/api/web-contents#contentsloadurlurl-options
   * @param vUrl
   * @param options={
   *      @Boolean forceLoad //初始化时强制绕过
   *      @String userAgent
   * }
   */
  loadUrl(vUrl = this._viewUrl, options = {forceLoad: false}) {
    if (!options.forceLoad && vUrl === this._viewUrl) {
      return;
    }
    this._viewUrl = vUrl;
    this._renderView.webContents.loadURL(vUrl, {
      httpReferrer: options.httpReferrer,
      userAgent: options.userAgent
    })
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
