const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
module.exports = function listAllPackages(name){
    const rootPath = path.join(process.cwd(),'../');
    if(fs.existsSync(rootPath+'/service.json')){
        const serviceJson = fse.readJsonSync(path.join(rootPath,'service.json'));
        if(serviceJson){
           console.table(serviceJson);
        }
    }
}