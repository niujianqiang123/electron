/**
 * Created by xiaogang on 2018/11/27.
 *
 */
"use strict";
//base
const {app, BrowserWindow, BrowserView} = require("electron");

//modules
const HomeWindow = require('./views/home/homeMain');


// todo : export default  class Main {
class Main {
    constructor(params) {
        //主窗口实例
        this.appWin = null;

    }

    //todo : init=()=> {
    init() {
        this.initApp();
    }


    initApp() {
        app.on('ready', () => {
            this.newMainWindow();
        });
        //mac os 当应用被激活时发出。 各种操作都可以触发此事件, 例如首次启动应用程序、尝试在应用程序已运行时或单击应用程序的坞站或任务栏图标时重新激活它。
        app.on('activate', () => {
            if (this.appWin == null) {
                this.newMainWindow();
            } else {
                this.appWin.show();
            }
        });
    }

    newMainWindow() {
        this.appWin = new HomeWindow();
        this.appWin.show();

    }
}

//实例运行！
new Main().init();
