/**
 * Created by xiaogang on 2018/12/16.
 * 模块类文件
 */
"use strict";

class ClassBars {
  constructor(params = {}) {
  }

  /**
   *
   * @param cb
   * @param eb
   * @param params
   */
  initTitle(cb = null, eb = null, params = []) {
    //1、params 参数预处理、兼容性处理等！

    //2、核心逻辑处理

    //3、回调结果处理
    if (Math.random() < 0.5) {
      cb(params)
    } else {
      eb(params)
    }
  }
}


module.exports = new ClassBars()
