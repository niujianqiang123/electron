/**
 * Created by xiaogang on 2018/11/27.
 *
 */
"use strict";

const {app, BrowserWindow} = require("electron");
let win = null;
const createWin = () => {
    win = new BrowserWindow({width: 800, height: 600});

    win.loadFile('./index.html');

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })

}


app.on('ready', createWin);