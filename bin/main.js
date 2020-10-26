#!/usr/bin/env node
const fs =require('fs');
const path = require('path');
const program =require('commander');
const ora = require('ora');
const chalk = require('chalk');
const create = require('./package-add');
//显示版本号
const version = require("./../package.json").version;
program.version(version,"-v,--version") ;  

//创建一个service   
program.command("add <service-name>")
    .action((name,command)=>{
        const currentDir = process.cwd().split('\\');
        const len = currentDir.length;
        if(currentDir[len-1] !== 'packages'){
            console.error(chalk.red('切换到packages目录再使用 yj-service-cli add 创建新的模块'))
        }else{
            //判断是否已经存在
            const isExists = fs.existsSync(path.resolve(process.cwd()+"\\"+name));
            if(isExists){
              console.error(chalk.red('该服务已存在'));
            }else{
                const spinner = ora('开始生成...\n');
                spinner.start();
                create(name,spinner,program);
            }
        }
    })

program.parse(process.argv);