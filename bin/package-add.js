const chalk =require('chalk');
const download = require('download-git-repo');
const url = 'https://github.com:yj-service/yj-service-cli#master/template';
module.exports = function(name,spinner,program){
    spinner.text = 'download template......';
    download(url,name,(err)=>{
        if(err){
            console.error(chalk.red(err)+"\n");
            spinner.stop(); 
        }else{
            spinner.stop(); 
        } 
   })
}