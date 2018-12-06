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

/**
 * todo:一片空白
 * https://github.com/electron/electron/pull/11300
 * https://github.com/electron/electron/issues/15874
 */
function renderDevTools() {
  let renderViewWebContents = null;
  if (renderView.getWebContents) {
    renderViewWebContents = renderView.getWebContents();
    renderViewWebContents.setDevToolsWebContents(devToolsView.getWebContents());
    renderViewWebContents.debugger.attach();
    renderViewWebContents.openDevTools({
      mode: 'detach'
    });


  }

}

