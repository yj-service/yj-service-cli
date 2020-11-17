const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const ora = require('ora');
const childProcess = require("child_process");
const ProgressBar = require("progress");

/**
 * @description 初始化项目时，初始lerna.json 安装vuepress vue.config.js
 */
module.exports = function initProject(){
    const currnetPath = process.cwd();
    const progressBar = new ProgressBar(":current/:total: :token1",{total:3,curr:0});
    addVuePressScript(currnetPath,progressBar);
    runSomeScript(progressBar); 
}
/**
 * @description 为package.json添加vuepress命令
 * @param {*} currnetPath 当前路径
 * @param {*} progressBar 进度条
 */
function addVuePressScript(currnetPath,progressBar){
    progressBar.tick({
        token1:"package.json增加docs命令\n",
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
    let docScripts ={};
    for(let index in scripts){
        docScripts[scripts[index].name] = scripts[index].value;
    }
   const newpkg =  Object.assign(oldPkg,{scripts:{...oldPkg.scripts,...docScripts}});
   fse.writeJSONSync(pkgPath,newpkg,{
       spaces:2
   });
}
/**
 * @description 下载初始化模板
 */
function downloadInitTpl(){

}
/**
 * @description 执行一些npm安装命令和lerna init操作
 */
function runSomeScript(progressBar){
    let spinner = ora();
    childProcess.exec('lerna init',(error, stdout, stderr)=>{
        progressBar.tick({
            token1:"lerna init\n"
        })
        if (error) {
            console.error(`检查是否全局安装lerna: ${error}`);
            return;
        }
        progressBar.tick({
            token1:"npm install vuepress\n",
        })
        spinner.text  = '开始下载vuepress...';
        spinner.start();
    }); 
    childProcess.exec('npm install -D vuepress --registry=https://registry.npm.taobao.org ',(error, stdout, stderr)=>{
        if (error) {
            console.error(`${error}`);
            spinner.stop();
        }
        console.log(stdout);
        spinner.text ="vuepress下载完成";
        spinner.succeed();
    })
}