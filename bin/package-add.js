const chalk =require('chalk');
const download = require('download-git-repo');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const url = 'https://github.com:yj-service/yj-service-cli#master';
module.exports = function(name,spinner,servicePath){
    download(url,name,{
        filter:(item)=>{
           return item.type == 'file' && /^template/.test(item.path)
        }
    },(err)=>{
        if(err){
            console.error(chalk.red(err)+"\n");
            spinner.stop(); 
        }else{
            spinner.text = '正在下载模板...'
            fse.copy(servicePath+'\\template',servicePath,(err)=>{
                if(err){
                    console.error(chalk.red('移动失败'))
                }
                fse.removeSync(servicePath+'\\template');
                createServiceJson(name,servicePath);
                spinner.succeed(`服务 ${name} 已生成`); 
            })
        } 
   })
}
/**
 * @param {string} name 服务名称
 * @param {string} servicePath 服务路径
 * @description 生成一个service.json文件，记录readme.md name path等路径，生成文档
 */
function createServiceJson(name,servicePath){
    // console.log(path.resolve(__dirname))
    const rootPath = path.join(process.cwd(),'../');
    const entryPath = path.join(servicePath,'index.js');
    const pkgJson = fse.readJsonSync(path.join(servicePath,'package.json'));  
    const version = pkgJson.version;  
    const docPath =path.join(servicePath,'README.md');
    let service = 
        {
            [name]: {
                name:pkgJson.name?pkgJson.name : name,
                path:getRelativePath(entryPath,'packages'),
                version:version,
                docPath:getRelativePath(docPath,'packages')
            }
        }
    if(fs.existsSync(rootPath+'/service.json')){
        const serviceJson = fse.readJsonSync(path.join(rootPath,'service.json'));
        if(serviceJson){
           service = {
               ...service,
               ...serviceJson,
           }
        }
    }
    fse.outputJSON(rootPath+'/service.json',service,(err)=>{ 
       if(err){
         console.error(chalk.red(err))
       }
    })
}
/**
 * @description 将绝对的地址
 * @param {string} path 路径
 * @param {string} pathFlag  要阶段的字符串
 */
function getRelativePath(path,pathFlag){
  if(path.indexOf(pathFlag)!=-1){
     return path.substring(path.indexOf(pathFlag))
  } 
  return path;
}