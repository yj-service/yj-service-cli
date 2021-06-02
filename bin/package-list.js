const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const inquirer = require('inquirer')
module.exports = function listAllPackages(name){
    inquirer.prompt([
        {
            type:"list",
            name:"select vue version",
            default:0,
            choices:['2.x','3.x']
        }
    ]).then(answers=>{
       console.log(answers)
    }).catch(error=>{

    })
    
    // const rootPath = path.join(process.cwd(),'../');
    // if(fs.existsSync(rootPath+'/service.json')){
    //     const serviceJson = fse.readJsonSync(path.join(rootPath,'service.json'));
    //     if(serviceJson){
    //        console.table(serviceJson);
    //     }
    // }
}