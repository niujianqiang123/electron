/**
 * created by homeRender on 2018/12/6
 * 功能：渲染线程
 */

//base
const {ipcRenderer} = require('electron');

//page
const renderView = document.getElementById('renderView');
const devToolsView = document.getElementById('devToolsView');


document.getElementById('toggleDevTools').addEventListener('click', () => {
  ipcRenderer.send('toggle-home-devTools')
});


window.onload = function (e) {
  renderDevTools();
  console.log(e);
};

renderView.addEventListener('dom-ready', () => {
  renderDevTools();
});


function renderDevTools() {
  let renderViewWebContents = null;
  if (renderView.getWebContents) {
    renderViewWebContents = renderView.getWebContents();
    renderViewWebContents.setDevToolsWebContents(devToolsView.getWebContents());
    renderViewWebContents.openDevTools();
  }

}

