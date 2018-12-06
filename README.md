# devTool
> 开发者工具


## 解决的问题
- 部署到第三方的代码调试！

- 第三方部署到云闪付APP！
> 客户端 **\[类似微信开发者工具公众号模式\]** ：采用 **electronjs** 构建跨平台应用。集成浏览器内核，构建基本的模拟运行环境！
> 
> 服务：采用扫码验证之后，自动构建一个本地或者公网 **服务** 。客户端临时访问该服务！
> 
> 调试 **\[类似微信开发者工具小程序模式\]** ：采用google开源的 **devtools** 代理客户端和服务端,连接真机和客户端间的断点和其他常见调试！ 



## todo
- [x] 窗口布局：let view = new BrowserView({})
- [ ] 采用class格式编写维护
- [ ] 自定义展示 devTools 的功能区域

### 语法（todo）
- [ ] export default  class Main {
- [ ] func=()=>{}

### bugs
- [ ] setDevToolsWebContents ：一片空白。亟待解决
