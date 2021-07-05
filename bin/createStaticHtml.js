const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const inquirer = require('inquirer')
const config = require('./config')
const chalk = require('chalk')
const client =require('scp2');
const ora = require('ora')

module.exports = function createStaticHmtl([input,title="网页标题",output='static']){
    input = input.replace(/[\./]/,'\\'); 
    global.input = input;
    global.title = title;
    global.output = output
    if(!fs.existsSync(input)){
      console.error('输入目录不存在')
      process.exit(-1);
    }
    if(!fs.existsSync(output)){
        fs.mkdirSync(output)
    }
    const current = process.cwd();
    const inputDir = path.join(current,input);
    const outDir = path.join(current,output+'\\'+input);
    if(fs.existsSync(outDir)){
        inquirer.prompt([
            {
                type:"list",
                message:"该文件夹已存在，是否覆盖？",
                name:"override",
                default:0,
                choices:['是','否']
            }
        ]).then((answer)=>{
            if(answer.override == '是'){
                renderHtml(inputDir,outDir,true)
            }else{
                process.exit(-1);
            }
            
        })
    }else{
        renderHtml(inputDir,outDir)
    }
}
/**
 * 拷贝所有图片文件到static对应目录下，生成html,并选择是否上传
 * @param {*} inputDir 
 * @param {*} outDir 
 * @returns Promise
 */
function renderHtml(inputDir,outDir,override=false){
    if(override){ //目录存在时，先删除
        fs.rmdir(outDir,{recursive:true},(err)=>{
            copyAssets(inputDir,outDir)
        })
    }else{
        copyAssets(inputDir,outDir)
    }
}
/**
 * 拷贝文件到目标目录
 * @param {*} inputDir 
 * @param {*} outDir 
 */
function copyAssets(inputDir,outDir){
    const paths = fs.readdirSync(inputDir)
    let imagesArr = []
    if(!fs.existsSync(outDir)){
       fs.mkdirSync(path.resolve(outDir),{recursive:true})   
       fs.mkdirSync(path.resolve(outDir+'\\images'),{recursive:true})   
    }
    paths.forEach((file)=>{
      const inputFile = path.join(inputDir,file);
      const outFile = path.join(outDir,'images'+'\\'+file);
      imagesArr.push(`./images/${file}`);
      fs.copyFileSync(inputFile,outFile)
    })
    createHtml(imagesArr,outDir);
}
function createHtml(imagesArr,outDir){
    //console.group(imagesArr)
    let html = ejs.render(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no">
    <title><%= title %></title>
    <style>*{padding:0;margin:0}</style>
</head>
<body>
<% imagesArr.forEach((file)=>{ %>
    <img src=<%= file %>  style="display:block;width:100%;"/>
<% }) %>
</body>
</html>
    `,{imagesArr,title:global.title})
    fs.appendFileSync(path.join(outDir,'index.html'),html,{encoding:'utf-8'})
    inquirer.prompt([
        {
            type:"list",
            message:"静态文件已生成，是否上传服务器？",
            name:"upload",
            default:0,
            choices:['是','否']
        }
    ]).then((answer)=>{
        if(answer.upload == '是'){
            uploadServer(outDir);
        }else{
            process.exit(-1);
        }
    })
}
/**
 * @description 上传到服务器，获取链接地址
 */
function uploadServer(){
    const server = require('./config').server;
    const envs = Object.keys(config.server); 
    inquirer.prompt([
        {
            type:"checkbox",
            message:"选择上传环境",
            name:"env",
            choices:envs
        }
    ]).then((answer)=>{
        const {env} = answer;
        let spinner = ora();
        spinner.text ="开始上传...\n";
        spinner.start();
        if(Array.isArray(env)){
            let old;
            const pagesJson = process.cwd()+'\\'+global.output+'\\pages.json'
            try {
                old = JSON.parse(fs.readFileSync(pagesJson,{encoding:'utf-8'}))
            } catch (error) {
                old = {}
            }
            env.map((key,index)=>{
                const {host,port,username,password,path,domin} = server[key]
                const url =`${domin}/h5/${global.input.replace('\\','/')}/index.html`
                client.scp(global.output,{
                    host,
                    port,
                    username,
                    password,
                    path
                },function(err){
                    if(!err){
                        console.log(`${key}文件上传成功：`+chalk.blue(`${url}\n`))
                        if(!old[key]){
                            old[key] = []
                        }
                        old[key].push({
                            path:global.input.replace('\\','.'),
                            title:global.title,
                            url
                        })
                        if(index == env.length-1){
                            fs.writeFileSync(pagesJson,JSON.stringify(old,null,4))
                            spinner.text ="上传完成...\n";
                            spinner.succeed();
                        }
                    }else{
                        console.log(err)
                    }
                })
            })
        }
    })
}
