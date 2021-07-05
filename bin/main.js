#!/usr/bin/env node
const program =require('commander');
const createPackage = require('./package-add');
const listAllPackages = require('./package-list');
const createProject = require('./project-create');
const initProject = require('./project-init');
const getConsultPackage = require('./getPackage')
// const runPackage = require('./package-run');
// const buildPackage = require('./package-build');
//显示版本号
const version = require("./../package.json").version;
const createStaticHtml = require('./createStaticHtml');
const chalk = require('chalk');
program.version(version,"-v,--version");

//创建一个项目
program.command("create <project-name>").description("use to create vue project")
        .action((name)=>{
            createProject(name,program); 
        }) 

//对新建的项目进行init
program.command("init").description("use to init project,add packages folder,install vue-press")
        .action(()=>{
            initProject();
        })         

//创建一个service   
program.command("add <service-name>").description('use to create a service').option('-c')
        .action((name)=>{
            createPackage(name,process.argv); 
        })

//显示所有服务
program.command("list").description('list all services')
        .action((name)=>{
            listAllPackages(name);
        })  
        
//获取咨询分包
program.command("getConsultPackage").description('get consult package')
        .alias('consult') 
        .action(()=>{
            getConsultPackage()
        })          
         
//图片生成静态页面
program.command("createHtml <inputDir> <title> [outputDir]").description('create static html by imgs')
        .alias('html') 
        .action(()=>{
            const params = process.argv.slice(3)
            if(params.length == 0){
                console.error(chalk.red('至少提供输入文件夹名称'))
                process.exit(0)
            }else{
                createStaticHtml(params)
            }
        })           
//运行开发环境
// program.command("dev <service-name>").description('todo:run service <service-name> on development env')
//        .action((name)=>{
//           runPackage(name);
//        })          

//打包项目
// program.command("build [service-name]").description('todo:build service [service-name]?')
//        .action((name)=>{      
//           buildPackage(name,program);
//        })              
program.parse(process.argv);