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
  // selectsBoxChange();
};

/**
 * 页面时间监听
 */
function initPageEvents() {
  /**
   * devTools
   */
  $('toggleDevTools').addEventListener('click', () => {
    ipcRenderer.send('home-toggle-devTools')
  });

  /**
   * input
   */
  $('renderPageUrl').addEventListener('keyup', (e) => {
    // console.log(e);
    if (e.keyCode === 13 || e.code === 'Enter' || e.key === 'Enter') {
      let _inputValue = e.target.value;
      //
      ipcRenderer.send('home-updateRenderUrl', _inputValue);
    }
  });

}


function $(id) {
  return document.getElementById(id);
}


