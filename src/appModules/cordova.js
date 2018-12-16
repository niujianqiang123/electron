/**
 * Created by xiaogang on 2018/12/16.
 * 模块集中管理
 */
//modules
const bars = require('./modules/classBars');
//
const modules = {
  pluginsBars: bars,
}

/**
 * 模块集中管理 对外调用类名（模块名称）
 * @type {{bars: ClassBars, exec: cordova.exec}}
 */
let cordova = {
  version: '0.0.1',
  email: 'wxungang@163.com',
  /**
   *
   * @param cb: callback
   * @param eb
   * @param cn: class name
   * @param fn: func name
   * @param params
   */
  exec: function (cb, eb, cn, fn, params = []) {
    modules[cn][fn](cb, eb, params);
  }

};

/**
 * 注入到全局
 * todo: 加入一个通知函数 。插件模块模拟完成
 */
window.cordova = cordova;
