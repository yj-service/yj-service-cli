#!/usr/bin/env node
const program =require('commander');
const createPackage = require('./package-add');
const listAllPackages = require('./package-list');
const createProject = require('./project-create');
const initProject = require('./project-init');
// const runPackage = require('./package-run');
// const buildPackage = require('./package-build');
//显示版本号
const version = require("./../package.json").version;
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
program.command("add <service-name>").description('use to create a service')
        .action((name)=>{
            createPackage(name); 
        })

//显示所有服务
program.command("list").description('list all services')
        .action((name)=>{
            listAllPackages(name);
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