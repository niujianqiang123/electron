/**
 * Created by xiaogang on 2018/12/10.
 * 窗口相关的 配置
 */
"use strict";


module.exports = {
  home: {
    bounds: {
      //主界面header区域的高度(保持和html渲染样式的设置高度一致)
      headerHeight: 100,
      width: 1104,
      height: 900,
      minWidth: 800,
      minHeight: 800
    }
  },
  render: {
    bounds: {
      // render 下拉选择菜单 区域高度
      menuHeight: 25,
      // x: 0,
      // y: 0,
      //render 宽高&内容高度 （内容宽度强制 自适应展开）
      width: 375 + 30 * 2,//自适应设置 viewWidth + 2 * marginX
      height: 800,//自适应设置 exports.home.bounds.height - exports.home.headerHeight
      contentHeight: 25 + 20 * 2 + 667 * 75 / 100,//自适应设置 menuHeight + 2 * marginY + viewHeight
      //deviceEmulation 物理宽高：view.bounds = deviceEmulation * percent
      viewSize: {
        width: 375,
        height: 667,
        //缩放 百分比
        percent: 75,
        //左右边界（100%比例下）
        marginX: 30,
        marginY: 20,
        //
        scrollTop: 0
      },

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
      //起始点 (默认 可以不配置)
      viewPosition: {
        x: 0,
        y: 0
      },
      //dpr :2
      deviceScaleFactor: 2,
      //fitToView: true,//没啥用
      //缩放 (默认 可以不配置)
      scale: 1
    },

  },


}
