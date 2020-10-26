const chalk =require('chalk');
const download = require('download-git-repo');
const url = 'https://github.com:yj-service/yj-service-cli#master';
module.exports = function(name,spinner,program){
    download(url,name,{
        filter:(item)=>{
           return item.type == 'file' && /^template/.test(item.path)
        }
    },(err)=>{
        if(err){
            console.error(chalk.red(err)+"\n");
            spinner.stop(); 
        }else{
            spinner.stop(); 
        } 
   })
}