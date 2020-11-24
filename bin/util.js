const download = require('download-git-repo');
const chalk =require('chalk');
/**
 * 
 * @param {*} url git仓库url
 * @param {*} destination  目标位置
 * @param {*} filter  过滤器
 * @param {Function} success 成功回调
 * @param {Function} error 失败回调
 */
function downloadTpl(url,destination,filter,success,error){
    download(url,destination,{
        filter:(item)=>{
           return filter ? item.type == 'file' && new RegExp(filter).test(item.path):item.type == 'file';
        }
    },(err)=>{
        if(err){
            console.error(chalk.red(err)+"\n");
            if(error && typeof error == 'function'){
                error(err);
            }    
        }else{
            if(success && typeof success == 'function'){
                success();
            }
        }
      }
    )
} 

module.exports = {
    downloadTpl
}
