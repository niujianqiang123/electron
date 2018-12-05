/**
 * Created by xiaogang on 2018/12/5.
 *
 */
"use strict";
(() => {
  renderDevTools();
})();

function renderDevTools() {
  const renderBox = document.getElementById('renderBox');
  const devToolsView = document.getElementById('devTools');
  renderBox.addEventListener('dom-ready', () => {
    const browser = renderBox.getWebContents();
    browser.setDevToolsWebContents(devToolsView.getWebContents());
    browser.openDevTools();
  })
}
