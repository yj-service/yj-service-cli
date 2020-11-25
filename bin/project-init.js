const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const ora = require('ora');
const childProcess = require("child_process");
const ProgressBar = require("progress");

const {downloadTpl} = require('./util');
const {gitRepository} = require('./config');


/**
 * @description 初始化项目时，初始lerna.json 安装vuepress vue.config.js
 */
module.exports = function initProject(){
    const currnetPath = process.cwd();
    const progressBar = new ProgressBar("[:current/:total]: :token1",{total:4,curr:0});
    progressBar.tick({
        token1:"下载配置文件\n",
    })
    let spinner = ora();
    spinner.text ="正在下载配置文件...";
    spinner.start();
    downloadTpl(gitRepository,currnetPath,'template-init',()=>{
        fse.copy(currnetPath+'\\template-init',currnetPath,(err)=>{
            if(err){
                console.error(chalk.red('移动失败'))
            }
            spinner.text ="下载完成";
            spinner.succeed();
            fse.removeSync(currnetPath+'\\template-init');
            fse.removeSync(currnetPath+'\\src');
            addSomeScript(currnetPath,progressBar);
            runSomeScript(progressBar);
        })
    },(err)=>{
        spinner.stop();
        console.error(chalk.red(err))
    })
}
/**
 * @description 为package.json添加vuepress命令
 * @param {*} currnetPath 当前路径
 * @param {*} progressBar 进度条
 */
function addSomeScript(currnetPath,progressBar){
    progressBar.tick({
        token1:"package.json增加命令\n",
    })
    const pkgPath = path.resolve(currnetPath+'\\package.json');
    const oldPkg = fse.readJsonSync(pkgPath);
    const scripts = [ 
        {
            name:"docs:dev",
            value:"vuepress dev docs"
        },
        {
            name:"docs",
            value:"vuepress build docs"
        }
    ]
    const husky = {
        "husky":{
            "hooks":{
                "commit-msg": "commitlint -E $HUSKY_GIT_PARAMS"
            }
        }
    }
    const otherConfig = {
        "publishConfig": {
            "access": "public"
        },
        "workspaces": ["packages/*"],
    }
    let docScripts ={};
    for(let index in scripts){
        docScripts[scripts[index].name] = scripts[index].value;
    }
   const newpkg =  Object.assign(oldPkg,{scripts:{...oldPkg.scripts,...docScripts}},{...husky},{...otherConfig});
   fse.writeJSONSync(pkgPath,newpkg,{
       spaces:2
   });
}
/**
 * @description 执行一些npm安装命令和lerna init操作
 * @param {*} progressBar 
 */
function runSomeScript(progressBar){
    let spinner = ora();
    childProcess.exec('lerna init',(error, stdout, stderr)=>{
        progressBar.tick({
            token1:"lerna init\n"
        })
        if (error) {
            console.error(`检查是否全局安装lerna: ${error}`);
            process.exit(1);
            return;
        }
        progressBar.tick({
            token1:"npm install vuepress @commitlint/cli @commitlint/config-conventional husky  qiankun\n",
        })
        spinner.text  = '开始下载...\n'; 
        spinner.start();
    }); 
    let p = new Promise((resolve,reject)=>{
        childProcess.exec('npm install qiankun -S --registry=https://registry.npm.taobao.org',(error1, stdout1)=>{
            if (error1) {
                reject(error1)
            } 
            console.log(stdout1+'\n\n');
            resolve(stdout1)
        })
    })
    p.then((stdout1)=>{
        childProcess.exec('npm install vuepress @commitlint/cli @commitlint/config-conventional husky -D  --registry=https://registry.npm.taobao.org',(error2, stdout2)=>{
            if (error2) {
                console.error(`${error2}`);
                spinner.stop();
            }
            const config = require(process.cwd()+'\\.serviceConfig.js');
            if(config.pcOrMobile == '1'){
                childProcess.exec('npm install postcss-pxtorem -D --registry=https://registry.npm.taobao.org',(error3, stdout3)=>{
                    if (error2) {
                        console.error(`${error3}`);
                        spinner.stop();
                    }
                    console.log(stdout2+'\n\n'+stdout3);
                    spinner.text ="下载完成";
                    spinner.succeed();
                })     
            }else{
                console.log(stdout2);
                spinner.text ="下载完成";
                spinner.succeed();
            }
        })
    })
}