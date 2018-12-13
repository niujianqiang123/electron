# devTool
> 开发者工具


## 解决的问题
- 部署到第三方的代码调试！

- 第三方部署到云闪付APP！
> 客户端 **\[类似微信开发者工具公众号模式\]** ：采用 **electronjs** 构建跨平台应用。集成浏览器内核 & 客户端插件，构建基本的模拟运行环境！
> 
> 服务：采用扫码验证之后，自动构建一个本地或者公网 **服务** 。客户端临时访问该服务！
> 
> 调试 **\[类似微信开发者工具小程序模式\]** ：采用google开源的 **devtools** 代理客户端和服务端,连接真机和客户端间的断点和其他常见调试！ 



## todo
- [x] 窗口布局：let view = new BrowserView({})
- [x] 采用class格式编写维护
- [x] 自定义展示 devTools 的功能区域
- [ ] 类 方法&属性私有化的处理 待优化 \[暂时 **_标识** & 同时不要去直接调用私有化的方法和属性，避免后续改造完影响正常使用] 
- [x] select 小于 100% 时显示bug!
- [x] renderWindow 中 contentHeight 设置问题！
- [x] renderWindow 滚动事件监听
- [ ] 三个抖动 性能优化
- [ ] BrowserView 被遮挡问题

### 语法
- [ ] export default  class Main {
- [ ] func=()=>{}

### bugs
- [x] setDevToolsWebContents ：一片空白。亟待解决
