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
ipcRenderer.on('home-renderPageUrl', (event, _inputValue) => {
  updateRenderViewSrc(_inputValue);
});

window.onload = function (e) {
  renderDevTools();
  console.log(e);
  updateRenderPageUrl();
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

function $(id) {
  return document.getElementById(id);
}


function updateRenderPageUrl() {
  //
  $('renderPageUrl').addEventListener('keyup', (e) => {
    // console.log(e);
    if (e.keyCode === 13 || e.code == 'Enter' || e.key == 'Enter') {
      let _inputValue = e.target.value;
      //
      ipcRenderer.send('home-renderPageUrl', _inputValue);
      // updateRenderViewSrc(_inputValue);
    }
  });
}

function updateRenderViewSrc(_inputValue) {
  if (!_inputValue) {
    return;
  }
  //
  $('renderView').setAttribute('src', _inputValue);
}
