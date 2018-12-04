/**
 * Created by xiaogang on 2018/12/3.
 *
 */
"use strict";

//base
const {app, ipcMain, BrowserWindow} = require('electron');

//modules
const {common} = require('../../config/index');

//pages
const PageUrl = './home.html';

class Home {
    constructor(params) {
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

        this.homeWin.loadURL(PageUrl);
        this.homeWin.webContents.openDevTools()
    }
}

module.exports = Home;