const download = require('download-git-repo');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const ora = require('ora');
const chalk =require('chalk');
const inquirer = require('inquirer')
const {downloadTpl} = require('./util');
const {gitRepository} = require('./config');

module.exports = function createPackage (name,argv){
    fse.ensureDirSync(process.cwd()+"\\packages");  //确保packages存在
    //判断服务是否已经存在
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
            const isClean = argv.slice(4).length>0;
            if(isClean){
                createCleanService(name,servicePath,answers) 
                return
            }
            const spinner = ora();
            spinner.text  = '开始生成...\n';
            spinner.start();
            downloadTemplate(name,spinner,servicePath,answers);
          
        })
    }
}
/**
 * @description 从git仓库下载模板文件
 * @param {*} name 
 * @param {*} spinner 
 * @param {*} servicePath 
 * @param {*} answers 
 */
function downloadTemplate(name,spinner,servicePath,answers){
    downloadTpl(gitRepository,servicePath,'template',()=>{
        spinner.text = '正在下载模板...'
        fse.copy(servicePath+'\\template',servicePath,(err)=>{
            if(err){
                console.error(chalk.red('移动失败'))
            }
            fse.removeSync(servicePath+'\\template');
            fse.removeSync(servicePath+'\\template-init');
            fse.removeSync(servicePath+'\\components\\index.vue');
            const pkgJson = fse.readJsonSync(path.join(servicePath,'package.json'));
            const config = require(process.cwd()+'\\.serviceConfig.js');
            let pkgName;
            if(config){
                if(config.prefix){
                    pkgName = `${config.prefix}-${name}`
                }else{
                    pkgName = name;
                }
            }else{
                console.error(chalk.red('读取配置失败'))
            }
           pkgName= pkgName.toLowerCase();
           fse.writeJSONSync(path.join(servicePath,'package.json'),{...{name:pkgName},...pkgJson,...answers},{spaces:2})
           const appName = name.slice(0, 1).toUpperCase() + name.slice(1);
           const filePath = servicePath+'\\index.js';
           const filePath1 = servicePath+'\\pages\\index.vue';
           const fd = fs.openSync(filePath,'r+');
           const fileData = fs.readFileSync(filePath,{encoding:'utf-8',flag:"r+"});
           const newFileData = `${fileData}`.replace(/Index/g,appName);
           fs.writeFileSync(filePath,newFileData);
           fs.closeSync(fd);
           const fd1 = fs.openSync(filePath1,'r+');
           const fileData1 = fs.readFileSync(filePath1,{encoding:'utf-8',flag:"r+"});
           const newFileData1 = `${fileData1}`.replace(/yj-service-demo/g,pkgName);
           fs.writeFileSync(filePath1,newFileData1);
           fs.closeSync(fd1);
           spinner.succeed(`服务 ${name} 已生成`); 
        })
    },()=>{
        console.error(chalk.red(err)+"\n");
        spinner.stop(); 
    })
}
/**
 * @description 生成简单项目，配置rollup打包
 * @param {*} name 
 * @param {*} servicePath 
 * @param {*} answers
 */
function createCleanService(name,servicePath,answers){
    const pkgName = `yj-${name}`;
    fse.ensureFileSync(servicePath+'\\package.json'); 
    fse.ensureFileSync(servicePath+'\\src\\index.js');
    const config = {
        "name":pkgName,
        "version":"0.0.1",
        "license": "ISC",
        "main":"src/index.js",
        ...answers,
    }
    fse.writeJSONSync(path.join(servicePath,'package.json'),{...config},{spaces:2});
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
    fse.writeJSON(rootPath+'/service.json',service,{spaces:2},(err)=>{ 
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