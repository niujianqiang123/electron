/**
 * Created by xiaogang on 2018/12/10.
 * 窗口相关的 配置
 */
"use strict";


module.exports = {
  home: {
    //主界面header区域的高度
    headerHeight: 100,
    bounds: {
      width: 1104,
      height: 900,
      minWidth: 800,
      minHeight: 800
    }
  },
  render: {
    bounds: {
      headerHeight: 100,//保持同步 exports.home.headerHeight
      width: 375 + 15 * 2,//自适应设置 exports.render.screenSize.width + 2 * exports.render.margin.x
      height: 800,//自适应设置 exports.home.bounds.height - exports.home.headerHeight
      percent: 75
    },
    screenSize: {
      width: 375,
      height: 667
    },
    margin: {
      x: 15,
      y: 50
    },
    /**
     * 默认采用iphone6
     *
     */
    deviceEmulation: {
      screenPosition: 'mobile',
      //屏幕 尺寸 & 同步 exports.render.screenSize
      screenSize: {
        width: 375,
        height: 667
      },
      //渲染 区域
      viewSize: {
        width: 375,
        height: 667
      },
      //起始点
      viewPosition: {
        x: 0,
        y: 0
      },
      //dpr :2
      deviceScaleFactor: 2,
      //缩放
      scale: 1
    },

  },


}
