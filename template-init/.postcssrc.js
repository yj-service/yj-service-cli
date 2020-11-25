module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 32,
      propList: ["*"] //（数组）可以从px更改为rem的属性
    },
    autoprefixer: {
      overrideBrowserslist: ["defaults", "ios >= 6.0"]
    }
  }
};
