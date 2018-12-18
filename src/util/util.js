/**
 * Created by xiaogang on 2018/12/18.
 *
 */
"use strict";
/**
 * 防抖动：连续触发事件时；控制间隔时间内不重复触发
 * @param fn
 * @param wait ：间隔时间(ms)
 * @param options = {
  *   maxWait: 250,
  *   trailing:true
  * }
 */
exports.debounce = function (fn, wait = 250, options = {
  maxWait: 250,
  trailing: true
}) {
  //定时器
  let timerId = null;
  let trailing = options.trailing;
  //事件的触发依然没有变化
  return function () {
    let _this = this;
    let _args = arguments;
    //时间间隔内触发先清除。不执行
    clearTimeout(timerId);
    //延迟 delay 执行
    timerId = setTimeout(function () {
      fn.apply(_this, _args)
    }, wait)
  }
}

/**
 *
 * @param fn
 * @param maxWait
 * @param options = {
 *   wait: 0,
 *   trailing:true
 * }
 */
exports.throttle = function (fn, maxWait = 250, options = {trailing: true}) {
  let timerId = null;
  let last;//上一次执行的时间
  let trailing = options.trailing;

  return function () {
    let _this = this;
    let _args = arguments;

    let _now = Date.now();
    if (last && _now - last < maxWait) {
      //时间间隔内触发先清除。不执行
      clearTimeout(timerId);
      //确保最后执行一次
      timerId = setTimeout(function () {
        last = _now;
        fn.apply(_this, _args)
      }, maxWait)
    } else {
      // 开始和maxWait 执行
      last = _now;
      fn.apply(_this, _args);
    }

  }
}
