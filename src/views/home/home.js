/**
 * Created by xiaogang on 2018/12/3.
 *
 */
"use strict";

//base
const path = require('path');
const {app, ipcMain, BrowserWindow} = require('electron');

//modules
const {common} = require('../../config/index');

//pages
// const PageUrl = 'https://wx.qq.com/?lang=zh_CN';
const PageFile = `${path.join(__dirname, './home.html')}`; // 默认相对于根目录

class Home {
    constructor(params) {
        this.isShow = false;
        this.homeWin = null;

        this.createWindow();

    }

    createWindow() {
        this.homeWin = new BrowserWindow({
            title: common.name,
            resizable: true,
            center: true,
            show: false,
            frame: true,
            autoHideMenuBar: true,
            width: common.window_size.width,
            minWidth: common.window_size.minWidth,
            height: common.window_size.height,
        });

        // this.homeWin.loadURL(PageUrl);
        this.homeWin.loadFile(PageFile);
        this.homeWin.webContents.openDevTools()
    }

    show() {
        this.homeWin.show();
        this.homeWin.focus();
        this.isShow = true;
    }
}

module.exports = Home;