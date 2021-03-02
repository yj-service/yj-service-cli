const glob = require("glob");
const path = require("path");
const { exit } = require("process");
const buildModule = process.argv.slice(4,5);
const isBuildModule = buildModule.length>0;
let alias = {}
function getModuleTitle(moduleName) {
  return require(`./packages/${moduleName}/package.json`).description
}
function getEneries() {
    let entries = {};
    let alias = {};
    const paths = glob.sync("./packages/*/index.js");
    for (let entry of paths) {
      const moduleName = path.basename(path.dirname(entry));
      const filename = isBuildModule?`index.html`:`${moduleName}.html`
      entries[moduleName] =  {
        title:`${getModuleTitle(moduleName)}`,
        entry:`packages/${moduleName}/index.js`,
        template:"public/index.html",
        filename:filename
      };
      alias[`@${moduleName}`] = path.resolve(`package\\${moduleName}`)
    }
    if(isBuildModule){
      return {
        [buildModule]:entries[buildModule]
      }  
    }else{
      return entries;
    }
}
/**
 * @description 开发环境启动单页开发
 */
function getEntryWhenDev(){
  if(process.env.NODE_ENV == 'production'){
     return undefined
  }else{
     if(!process.env.npm_config_service){
        console.error('缺少参数,执行 npm run serve:[env] --service=[serviceName]\n\n')
        exit()
     }else{
       return './'+ pages[process.env.npm_config_service].entry 
     }
  }
 }
const pages = getEneries();
const entry = getEntryWhenDev();

module.exports = {
    lintOnSave:false,
    publicPath:process.env.NODE_ENV == 'production' ? "./" : "/",
    productionSourceMap:process.env.NODE_ENV == 'production' ? false : true,
    assetsDir:"static",
    outputDir:isBuildModule ? `dist/${buildModule}` : 'dist',
    pages:process.env.NODE_ENV == 'production' ? pages :undefined,
    configureWebpack:{
      entry:entry,
      resolve: {
        alias: {
          '@':path.resolve(__dirname),
          ...alias  
        }
      },
      devServer:{
        headers:{
          'Access-Control-Allow-Origin':'*'
        },
      // proxy:{
      //   '/api': {
      //     target: 'url',
      //     changeOrigin: true,
      //     pathRewrite:{}
      //   },
      // }
      }
    },
    pluginOptions: {
      'style-resources-loader': {
        preProcessor: 'less',
        patterns: ['src/assets/style/common.less']
      }
    }
}
