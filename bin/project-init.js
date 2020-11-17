const fs = require("fs");
const fse = require("fs-extra");
const path = require("path");
const {spawn} = require("child_process")

/**
 * @description 初始化项目时，初始lerna.json 安装vuepress vue.config.js
 */
module.exports = function initProject(){
    const currnetPath = process.cwd();
    addVuePressScript(currnetPath);
    downloadInitTpl();  
}
/**
 * @description 为package.json添加vuepress命令
 * @param {*} currnetPath 当前路径
 */
function addVuePressScript(currnetPath){
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
function runSomeScript(){
   
}