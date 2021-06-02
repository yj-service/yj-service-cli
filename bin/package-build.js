const path = require("path");
const fs = require("fs");
const fse = require("fs-extra");
module.exports = function buildPackage(name,program){
    const rootPath = path.join(process.cwd(),'../');
    if(name){
        //判断服务是否存在
        const servicePath = path.resolve(process.cwd()+"\\"+name);
        const isExists = fs.existsSync(servicePath);
        if(!isExists){
          console.error(chalk.red(`服务 ${name} 不存在`))
          return;
        }
        buildSingleService(name);
    }else{
        buildAll()
    }
}
/**
 * @description 打包所有服务
 */
function buildAll(){
    
}
/**
 * @description 打包单个服务
 */
function buildSingleService(name){ 
    const rootPath = path.join(process.cwd(),'../');
    const vueConfig = rootPath+'/vue.config.js';
    fse.ensureFileSync(vueConfig)
    fse.writeJSONSync(vueConfig,{
        pages:{
          [name]:{
            entry:"src/main.js",
            template:"public/index.html"
          }
        }
    })
}