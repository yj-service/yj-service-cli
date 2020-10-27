const chalk =require('chalk');
const download = require('download-git-repo');
const path = require('path');
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
                fse.remove(servicePath+'\\template');
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
    const rootPath = path.join(__dirname,'../');
    const entryPath = path.join(servicePath,'index.js');
    const version = fse.readJsonSync(path.join(servicePath,'package.json'));    
    console.log(version)
    const docPath =path.join(servicePath,'README.md');
    console.log('rootPath',rootPath)
    console.log('entryPath',entryPath)
    console.log('version',version)
    console.log('docPath',docPath)
    // fse.outputJSON(rootPath+'/service.json',
    // {
    //   [name]:{
    //       name:name,
    //       path:path.join(servicePath,'index.js'),
    //       version:require(servicePath+'\\package.json').version,
    //       docPath:path.join(servicePath,'README.md')
    //   }
    // },(err)=>{ 
    //    if(err){
    //      console.error(chalk.red(err))
    //    }
    // })
}