module.exports = {
  lintOnSave: true,
  devServer: {
    open: true, // 项目运行自动开启浏览器
    port: 20001 // 给项目运行创建web服务的端口号码(1~65535之间)
  },
  configureWebpack: config => { // 配置打包文件
    // 配置 externals
    // 防止将某些 import 的包(package)打包到 bundle 中，
    // 而是在运行时(runtime)再去从外部获取这些扩展依赖
    config.externals = {
      // 模块名(from后边的名字): 构造函数名称(文件内部提供的全局变量名字)
      vue: 'Vue',
      axios: 'axios',
      'vue-router': 'VueRouter',
      echarts: 'echarts',
      nprogress: 'NProgress'
    }
  }
}
