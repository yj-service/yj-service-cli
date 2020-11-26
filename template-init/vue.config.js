const glob = require("glob");
const path = require("path");
const buildModule = process.argv.slice(5);
const isBuildModule = buildModule.length>0;
let alias = {}
function getEneries() {
    let entries = {};
    let alias = {};
    const paths = glob.sync("./packages/*/index.js");
    for (let entry of paths) {
      const moduleName = path.basename(path.dirname(entry));
      const filename = isBuildModule?`index.html`:`${moduleName}.html`
      entries[moduleName] =  {
        title:`${moduleName}`,
        entry:`packages/${moduleName}/index.js`,
        template:"public/index.html",
        filename:filename,
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      };
      alias[`@${moduleName}`] = path.resolve(`package\\${moduleName}`)
    }
    return entries;
}
const pages = getEneries();
module.exports = {
    publicPath:"./",
    productionSourceMap:process.env.NODE_ENV == 'production'?false:true,
    assetsDir:"static",
    pages:isBuildModule ? {[buildModule]:pages[buildModule]} : pages,
    configureWebpack:{
      resolve: {
        alias: alias
      },
      // output: {
      //   library: `${name}-[name]`,
      //   libraryTarget: 'umd',
      //   jsonpFunction: `webpackJsonp_${name}`,
      // },
    }
}
