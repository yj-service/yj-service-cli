const chalk =require('chalk');
const download = require('download-git-repo');
const fse = require('fs-extra');
const url = 'https://github.com:yj-service/yj-service-cli#master';
module.exports = function(name,spinner,servicePath){
    download(url,name,{
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
                fse.remove(servicePath+'\\template');
                spinner.succeed('服务已生成'); 
            })
        } 
   })
}