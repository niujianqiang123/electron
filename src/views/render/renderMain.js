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
const cordova = `${path.join(__dirname, '../../appModules/cordova.js')}`;

//pages
const pageUrl = `file://${path.join(__dirname, './render.html')}`; // 默认相对于根目录
const viewUrl = `file://${path.join(__dirname, './view.html')}`; // 默认相对于根目录


class Render {
  constructor(params = {}) {
    // console.log(`--new Render constructor--`);
    // console.log(params);
    //私有属性
    this._homeWin = params.homeWin;
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
    this._setContentSize();

    // this.win.webContents.openDevTools({
    //   mode: 'detach'
    // })
  }

  /**
   * for deviceEmulation render
   */
  _createRenderView(params = {}) {
    let _params = Object.assign({}, params, {
      webPreferences: {
        preload: cordova,
      }
    });
    this._renderView = new BrowserView(_params);
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
   * todo: 设置无效！
   * 设置 renderHtml 内容高度
   * @private
   */
  _setContentSize() {
    console.log('------------renderMain && _setContentSize------------');
    console.log(this._bounds);
    this.win.send('renderMain-update-contentHeight', this._bounds);
  }

  /**
   * 设置 渲染区 位置
   */
  _setRenderViewBounds(bounds = this._bounds) {
    console.log('------------renderMain && setRenderViewBounds------------');
    // console.log(bounds);
    // console.log(bounds.viewSize.width * bounds.viewSize.percent / 100);
    // console.log(bounds.viewSize.height * bounds.viewSize.percent / 100);
    this._renderView.setBounds({
      x: bounds.viewSize.marginX + Math.floor(bounds.viewSize.width * (100 - bounds.viewSize.percent) / 200),
      y: bounds.viewSize.marginY + bounds.menuHeight - bounds.viewSize.scrollTop,
      width: Math.floor(bounds.viewSize.width * bounds.viewSize.percent / 100),
      height: Math.floor(bounds.viewSize.height * bounds.viewSize.percent / 100),
    })
  }

  /**
   *
   * @param bounds
   * @param updateParent 是否更新之后通知父级窗口（影响父级窗口布局）
   * @private
   */
  _updateBound(bounds, updateParent = false) {
    console.log(`-----------renderMain---_updateBound-----------`);
    console.log(this._bounds);
    console.log(bounds);
    //优化浅拷贝 对象的 bug
    if (bounds.viewSize) {
      let _viewSize = Object.assign({}, this._bounds.viewSize, {scrollTop: 0}, bounds.viewSize);
      console.log(_viewSize);
      this._bounds = Object.assign({}, this._bounds, bounds, {
        viewSize: _viewSize,
        contentHeight: (bounds.menuHeight || this._bounds.menuHeight) + 2 * _viewSize.marginY + _viewSize.height * _viewSize.percent / 100
      });
    } else {
      this._bounds = Object.assign({}, this._bounds, bounds);
    }

    //默认不通知父级更新
    updateParent && this._homeWin.updateRenderBounds(this._bounds, updateParent);
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
  _optionsChange(options = {}) {
    console.log(`--------renderMain & _optionsChange---------`);
    let _viewSize = {};
    let _deviceEmulation = {};
    console.log(options);

    //todo 根据options 调整 margin
    // this.renderConfig.margin
    //更新 配置数据
    if (options.percent) {
      _viewSize.percent = Math.floor(options.percent);
      _deviceEmulation.scale = options.percent / 100;
    }

    if (options.dpr) {
      _deviceEmulation.deviceScaleFactor = Number(options.dpr);
    }

    if (options.width && options.height) {
      _viewSize =
        _deviceEmulation.screenSize =
          _deviceEmulation.viewSize = {
            width: Math.floor(options.width),
            height: Math.floor(options.height)
          }

      this.setBounds({
        // x: this._bounds.x,
        // y: this._bounds.y,
        width: Math.floor(options.width) + this._bounds.viewSize.marginX * 2,
        // height: this._bounds.height
      });

    }

    this._updateBound({
      viewSize: _viewSize,//Object.assign({}, this._bounds.viewSize, _viewSize)
    }, true);
    this._setRenderViewBounds();

    this._updateDeviceEmulation(_deviceEmulation);
    this._enableDeviceEmulation(this._renderView.webContents);

    this._setContentSize();
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

    ipcMain.on('render-window-scroll', (e, scrollTop = 0) => {
      if (scrollTop <= 0 && this._bounds.contentHeight - this._bounds.height < scrollTop) {
        return;
      }
      this._updateBound({
        viewSize: {
          scrollTop: Math.floor(scrollTop),
        }
      });
      this._setRenderViewBounds();
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
   * 调整 renderWin 位置&更新 数据
   *
   */
  setBounds(bounds = this._bounds, updateParent = false) {
    console.log(`--------render--setBounds----------`);
    console.log(bounds);
    //保存数据 & 同时更新渲染
    this._updateBound(bounds);
    //优化： 可以只传递 更新的值
    let _bounds = {
      x: bounds.x || this._bounds.x,
      y: bounds.y || this._bounds.y,
      width: bounds.width || this._bounds.width,
      height: bounds.height || this._bounds.height
    }
    this.win.setBounds(_bounds, true);

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

  close() {
    this._parentWin = null;
    this._renderView.destroy();
    this.win.destroy();
  }

  /**
   *
   */
  show() {
    this.win.once('ready-to-show', () => {
      this.win.show();
      this.win.focus();
      this.isShow = true;
    });
  }
}

module.exports = Render;
