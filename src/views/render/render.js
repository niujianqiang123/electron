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


class Render {
  constructor(params = {}) {
    console.log(`--new Render constructor--`);
    console.log(params);
    //定义 对象实例（new ClassName） 的属性
    this.parentWin = params.parentWin || null;
    this.title = params.title || 'render view';
    this.pageUrl = params.pageUrl || pageUrl;
    this.renderConfig = params.renderConfig || winConfig.render;
    //跟随主窗口 没法设置默认值
    this.bounds = params.bounds;

    this.isShow = params.show || false;

    this.win = null;
    this.createWindow();
    this.instanceEvents();
  }


  createWindow() {
    this.win = new BrowserWindow({
      title: this.title,
      parent: this.parentWin,
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


    this.loadUrl(this.pageUrl, {forceLoad: true});
    this.setBounds();
    // this.win.webContents.openDevTools()
  }

  /**
   *  https://electronjs.org/docs/api/web-contents#contentsloadurlurl-options
   * @param pUrl
   * @param options={
   *      @Boolean forceLoad //初始化时强制绕过
   *      @String userAgent
   * }
   */
  loadUrl(pUrl = this.pageUrl, options = {forceLoad: false}) {
    //update pageUrl
    if (!options.forceLoad && pUrl === this.pageUrl) {
      return;
    }
    this.pageUrl = pUrl
    this.preFixStyle();
    this.win.loadURL(pUrl, {
      httpReferrer: options.httpReferrer,//'https://electronjs.org'
      userAgent: options.userAgent
    });
  }

  /**
   * https://github.com/electron/electron/issues/4099
   * You should call enableDeviceEmulation after the page gets loaded.
   * @param params
   */
  enableDeviceEmulation(params = this.renderConfig.deviceEmulation) {
    console.log(params);
    this.win.webContents.enableDeviceEmulation(params)
  }

  /**
   * 开启 devTools
   * @param webContents
   */
  setDevToolsWebContents(webContents) {
    this.win.webContents.setDevToolsWebContents(webContents)

    // Open the DevTools.
    this.win.webContents.openDevTools({mode: 'detach'})
  }

  /**
   *
   * @param bounds
   */
  updateBound(bounds) {
    this.bounds = bounds;
  }

  /**
   * 根据父窗口调整位置
   *
   */
  setBounds(bounds = this.bounds, margin = this.renderConfig.margin, screenSize = this.renderConfig.deviceEmulation.screenSize) {
    let _width = bounds.width - 2 * margin.x;
    let _height = bounds.height - 1.5 * margin.y;//Math.round(_width * (screenSize.height / screenSize.width));
    let _bounds = {
      x: bounds.x + margin.x,
      y: bounds.y + margin.y,
      width: _width,
      height: _height
    }
    // console.log(`--------render--setBounds----------`);
    // console.log(_bounds);
    //保存数据 & 同时更新渲染
    this.win.setBounds(_bounds, true);
    this.updateBound(bounds);
  }

  /**
   * todo:
   * 更新 & 重新渲染
   */
  optionsChange(options = {}, margin = this.renderConfig.margin) {
    console.log(options);
    console.log(margin);

    //todo 根据options 调整 margin
    // this.renderConfig.margin
    //更新 配置数据
    if (options.percent) {
      this.renderConfig.bounds.percent = options.percent;

    }

    if (options.dpr) {
      this.renderConfig.deviceEmulation.deviceScaleFactor = Math.floor(options.dpr)
    }

    if (options.width && options.height) {

      // this.renderConfig.bounds.width = options.width + this.renderConfig.margin.x;
      //
      // this.renderConfig.deviceEmulation.viewSize.width = this.renderConfig.deviceEmulation.screenSize.width = Math.floor(options.width);
      // this.renderConfig.deviceEmulation.viewSize.height = this.renderConfig.deviceEmulation.screenSize.height = Math.floor(options.height);
    }

    // let _bounds = {
    //   x: this.bounds.x + margin.x,
    //   y: this.bounds.y + margin.y,
    //   width: options.width - 2 * margin.x,
    //   height: options.height - 1.5 * margin.y
    // }
    //
    // console.log(_bounds);
    // this.win.setBounds(_bounds, true);
  }

  preFixStyle() {
    // this.win.webContents.insertCSS(htmlScroll);

  }

  /**
   * 实例事件
   */
  instanceEvents() {
    this.win.webContents.on('dom-ready', (e) => {
      this.preFixStyle();
    });

    this.win.webContents.on('did-finish-load', (e) => {
      this.enableDeviceEmulation();
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
