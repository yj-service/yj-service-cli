const fs = require("fs");
const fse = require("fs-extra");
const {spawn} = require("child_process")

/**
 * @description 初始化项目时，初始lerna.json 安装vuepress vue.config.js
 */
module.exports = function initProject(){
    const cwd = process.cwd();
    const initProcess = spawn("cmd.exe");

}