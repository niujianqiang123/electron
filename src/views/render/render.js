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
  selectsBoxChange();
};

/**
 * 页面时间监听
 */
function initPageEvents() {
  /**
   * select change
   */
  document.querySelectorAll('select').forEach(item => {
    item.addEventListener('change', function (e) {
      console.log(e);
      selectsBoxChange(e && e.target);
    });
  })

}


function $(id) {
  return document.getElementById(id);
}


function selectsBoxChange(target) {
  let _options = {};
  if (target) {
    _setSelect(target)
  } else {
    //遍历 selects
    $('selectsBox').querySelectorAll('select').forEach(item => {
      _setSelect(item)
    });
  }
  console.log(`------ homeRender---selectsBoxChange-----`);
  console.log(_options);

  renderChange(_options)

  /**
   * 获取 select 信息
   * @param target
   * @private
   */
  function _setSelect(target) {
    let _id = target.id;
    let _text = target.options[target.selectedIndex || 0].text;
    let _value = target.value.split('*');
    // console.log(`${_text}_${_value}`);
    // console.log(item.previousElementSibling);
    //show text
    target.previousElementSibling.innerText = _text.replace(/\(.+?\)/g, '');

    // set _options
    if (_id === 'phoneType') {
      _options.width = _value[0];
      _options.height = _value[1];
      _options.dpr = _value[2];
    } else if (_id === 'percent') {
      _options.percent = _value[0];
    } else {
      _options.network = _value[0]
    }
  }
}

/**
 *
 */
function renderChange(options) {
  ipcRenderer.send('render-select-options', options);
}

