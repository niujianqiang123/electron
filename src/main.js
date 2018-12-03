/**
 * Created by xiaogang on 2018/11/27.
 *
 */
"use strict";

const {app, BrowserWindow,BrowserView} = require("electron");
let win = null;
const createWin = () => {
    win = new BrowserWindow({width: 800, height: 600});


    let child = new BrowserWindow({
        titleBarStyle: "hidden",
        frame: false,
        parent: win,
        y: 100,
        x: 0,
        width: 80,
        height: 60
    });
    child.loadFile('./index.html');
    child.show();

    win.loadFile('./index.html');


    let view = new BrowserView({
        webPreferences: {
            nodeIntegration: false
        }
    })
    win.setBrowserView(view)
    view.setBounds({ x: 0, y: 0, width: 300, height: 300 })
    view.webContents.loadURL('https://electronjs.org')

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })

}


app.on('ready', createWin);