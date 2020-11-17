const download = require('download-git-repo');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const ora = require('ora');
const chalk =require('chalk');
const inquirer = require('inquirer')
const url = 'https://github.com:yj-service/yj-service-cli#master';
module.exports = function createPackage (name){
    fse.ensureDirSync(process.cwd()+"\\packages");  //确保packages存在
    //判断是否已经存在
    const servicePath = path.resolve(process.cwd()+"\\packages\\"+name);
    const isExists = fs.existsSync(servicePath);
    if(isExists){
        console.error(chalk.red('该服务已存在'));
    }else{
        
        inquirer.prompt([
            {
                name:'description',
                message:"请输入服务描述:"
            },
            {
                name:'author',
                message:"请输入作者名称:"
            }
        ]).then((answers)=>{
            const spinner = ora();
            spinner.text  = '开始生成...';
            spinner.start();
            downloadTemplate(name,spinner,servicePath,answers);
        })
    }
}
/**
 * @description 从git仓库下载模板文件
 */
function downloadTemplate(name,spinner,servicePath,answers){
    download(url,servicePath,{
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
                fse.removeSync(servicePath+'\\template-init');
                fse.removeSync(servicePath+'\\components\\index.vue');
                const pkgJson = fse.readJsonSync(path.join(servicePath,'package.json'));
                fse.writeJSONSync(path.join(servicePath,'package.json'),{...pkgJson,...answers},{spaces:2})
                createServiceJson(name,servicePath,pkgJson);
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
    const rootPath = path.join(process.cwd());
    const entryPath = path.join(servicePath,'index.js');  
    const pkgJson = fse.readJsonSync(path.join(servicePath,'package.json'));
    const version = pkgJson.version;
    const author =  pkgJson.author;
    const description = pkgJson.description;
    const docPath =path.join(servicePath,'README.md');
    let service = 
        {
            [name]: {
                name:pkgJson.name?pkgJson.name : name,
                path:getRelativePath(entryPath,'packages'),
                version:version,
                author:author,
                description:description,
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