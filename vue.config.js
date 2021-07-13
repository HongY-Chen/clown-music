module.exports = {
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          require("autoprefixer")({
            // 配置使用 autoprefixer 兼容浏览器版本
            overrideBrowserslist: ["last 15 versions"]
          }),
          require("postcss-pxtorem")({
            //根元素(html)的字体大小
            rootValue: 37.5,
            //rootValue: 37.5, 如果是Vant的话根字体是37.5
            propList: ["*"],
          })
        ]
      }
    }
  }
};