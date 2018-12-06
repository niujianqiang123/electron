/**
 * created by homeRender on 2018/12/6
 * 功能：渲染线程
 */


const {ipcRenderer} = require('electron');

document.getElementById('devTools').addEventListener('click', () => {
  ipcRenderer.send('toggle-home-devTools')
});



