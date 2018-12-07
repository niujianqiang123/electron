/**
 * created by homeRender on 2018/12/6
 * 功能：渲染线程
 */

//base
const {ipcRenderer} = require('electron');

//page




window.onload = function (e) {
  console.log(e);
  initPageEvents();
  initIpcRendererEvents();

  // renderDevTools();
};
/**
 * 更新 webview src 就会触发该事件
 */
$('renderView').addEventListener('dom-ready', (e) => {
  console.log(e);
  renderDevTools();
});
/**
 * 更新 webview src 就会触发该事件
 */
$('renderView').addEventListener('did-frame-finish-load',(e)=>{
  console.log(e);
  // renderDevTools();
});


/**
 * 页面时间监听
 */
function initPageEvents() {
  /**
   * devTools
   */
  $('toggleDevTools').addEventListener('click', () => {
    ipcRenderer.send('toggle-home-devTools')
  });

  /**
   * input
   */
  $('renderPageUrl').addEventListener('keyup', (e) => {
    // console.log(e);
    if (e.keyCode === 13 || e.code == 'Enter' || e.key == 'Enter') {
      let _inputValue = e.target.value;
      //
      ipcRenderer.send('home-updateRenderUrl', _inputValue);
    }
  });
}

/**
 * 页面和主线程间的通信
 */
function initIpcRendererEvents() {
  ipcRenderer.on('home-updateRenderUrl', (event, _inputValue) => {
    console.log(_inputValue);
    updateRenderViewSrc(_inputValue);
  });
}

/**
 * todo:一片空白
 * https://github.com/electron/electron/pull/11300
 * https://github.com/electron/electron/issues/15874
 */
function renderDevTools() {
  let devToolsView = $('devToolsView');
  let renderView = $('renderView');
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


function updateRenderViewSrc(_inputValue) {
  if (!_inputValue) {
    return;
  }
  //
  $('renderView').setAttribute('src', _inputValue);
  // $('renderView').loadURL(_inputValue);
}
