/**
 * Created by xiaogang on 2018/12/4.
 *
 */
"use strict";
const common_zh = require('./common_zh');
const common_en = require('./common_en');
const winConfig = require('./window');
//todo:后续 用户可自定义设置！
const lan = 'zh';

module.exports = {
  lan: lan,
  common: lan === 'zh' ? common_zh : common_en,
  winConfig: winConfig
}
