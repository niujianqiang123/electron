/**
 * Created by xiaogang on 2018/12/3.
 * 主线程
 */
"use strict";

//base
const path = require('path');
const {app, ipcMain, BrowserWindow, BrowserView, dialog} = require('electron');

//modules
const util = require('../../util/util');
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
   * 创建render 子窗口（BrowserWindow 内嵌 webView）
   * 1、webView 内 require('electron') 报require error。API有限制
   * 2、webView 嵌套渲染 webView（for render box）& webview (for devTools box)时 renderView.getWebContents() 报错：undefined is not a function 即：API有限制
   */
  _createRenderWindow() {
    this._renderWin = new RenderWindow({
      pageUrl: this._renderUrl,
      parentWin: this.homeWin,
      bounds: this._getContentBounds().render,
      /**
       * todo :子类更新时，同步更新其他子类布局
       * 1、把 父类的实例 传递给子类。便于在 [仿真器]子类 的 私有更新函数 中调用父类的 实例更新函数 去集中控制整体布局更新
       * 2、把需要和 [仿真器]子类 私有更新函数 保持同步更新的其他 子类实例 传递给 [仿真器]子类，在 [仿真器]子类 的 私有更新函数 里面控制各实例的布局更新
       * 3、在homeMain 类里面监听 selectChange事件，通过父类传递到子类去！『推荐』
       */
      homeWin: this,
    });

    if (!this._renderWin.isShow) {
      this._renderWin.show();
    }

    this._setDevToolsWebContents();
  }

  _createDevToolsWindow() {
    this._devToolsWin = new DevToolsWindow({
      parentWin: this.homeWin,
      bounds: this._getContentBounds().devTools
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
    ipcMain.on('home-refresh', (event) => {
      this.reload();
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
    this.homeWin.on('move', util.throttle((e) => {
      this._updateChildBounds();
    }, 50));

    /**
     * todo: 加入去抖动函数
     * tips:打开任务管理器，移动时: cpu 占用瞬间飙升
     */
    this.homeWin.on('resize', util.debounce((e) => {
      this._updateChildBounds();
    }, 150));

    // this.homeWin.on('close', (e) => {
    //   this.close();
    // })
  }

  /**
   * 更新子窗口
   * @param fromChild : Boolean 是否来自子类更新之后通知父级窗口（避免死循环）
   * @private
   */
  _updateChildBounds(fromChild) {
    let _newContentBounds = this._getContentBounds();
    // console.log(`-------homeMain--_updateChildBounds------`);
    // console.log(_newContentBounds);
    !fromChild && this._renderWin && this._renderWin.setBounds(_newContentBounds.render);
    this._devToolsWin && this._devToolsWin.setBounds(_newContentBounds.devTools);
  }

  /**
   * init or move or resize 的时候获取最新的 内容边界值
   */
  _getContentBounds() {
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

  /**
   * 用户更新 selects 时
   * @param params={
   *    @Integer width
   *    @Integer height
   *    @Number percent
   *    @Integer marginX
   *    @Integer marginTop
   * }
   *
   * @param fromChild : Boolean 是否来自子类更新之后通知父级窗口（避免死循环）
   */
  updateRenderBounds(params = {}, fromChild = true) {
    console.log(`----------homeMain updateRenderBounds----------`)
    this._renderBounds = params;
    // console.log(params);
    // console.log(this);
    this._updateChildBounds(fromChild);

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

  reload() {
    this._renderUrl && this._renderWin.loadUrl(this._renderUrl, {forceLoad: true});
  }

  close() {
    console.log(`-----------homeMain-close--------`);
    this._renderWin.close();
    this._devToolsWin.close();
    //销毁自己实例
    this._renderWin = null;
    this._devToolsWin = null;
    this.homeWin.destroy();
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
