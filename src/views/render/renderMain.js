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
    this.loadUrl(this._viewUrl, {forceLoad: true});
    this._setBrowserView();
    this._setRenderViewBounds();
  }

  _setBrowserView() {
    if (this.win && this._renderView) {
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
    console.log('------------renderMain && _enableDeviceEmulation------------');
    console.log(params);
    webContents.enableDeviceEmulation(params)
  }


  /**
   * 设置 渲染区 位置
   */
  _setRenderViewBounds(bounds = this._bounds) {
    console.log('------------renderMain && setRenderViewBounds------------');
    console.log(bounds);
    console.log(bounds.viewSize.width * bounds.viewSize.percent / 100);
    console.log(bounds.viewSize.height * bounds.viewSize.percent / 100);
    this._renderView.setBounds({
      x: bounds.viewSize.marginX + Math.floor(bounds.viewSize.width * (100 - bounds.viewSize.percent) / 200),
      y: bounds.viewSize.marginY + bounds.menuHeight,
      width: Math.floor(bounds.viewSize.width * bounds.viewSize.percent / 100),
      height: Math.floor(bounds.viewSize.height * bounds.viewSize.percent / 100),
    })
  }

  /**
   *
   * @param bounds
   * @private
   */
  _updateBound(bounds) {
    this._bounds = Object.assign({}, this._bounds, bounds);
  }

  /**
   *
   * @param deviceEmulation
   * @private
   */
  _updateDeviceEmulation(deviceEmulation) {
    this._deviceEmulation = Object.assign({}, this._deviceEmulation, deviceEmulation);
  }

  /**
   * todo:
   * 更新 & 重新渲染
   */
  _optionsChange(options = {}, margin = {}) {
    console.log(`--------renderMain & _optionsChange---------`);
    let _viewSize = {};
    let _deviceEmulation = {};
    console.log(options);

    //todo 根据options 调整 margin
    // this.renderConfig.margin
    //更新 配置数据
    if (options.percent) {
      _viewSize.percent = options.percent;
    }

    if (options.dpr) {
      _deviceEmulation.deviceScaleFactor = options.dpr;
    }

    if (options.width && options.height) {
      _viewSize = {
        width: options.width,
        height: options.height
      }
      _deviceEmulation.screenSize = {
        width: options.width,
        height: options.height
      };
      _deviceEmulation.viewSize = {
        width: options.width,
        height: options.height
      }

      this._updateDeviceEmulation(_deviceEmulation);
    }

    this._updateBound({
      viewSize: Object.assign({}, this._bounds.viewSize, _viewSize)
    });
    // this.setBounds();
    this._setRenderViewBounds();
    this._enableDeviceEmulation(this._renderView.webContents);
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
