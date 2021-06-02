const inquirer = require('inquirer')
module.exports = function createProject(projectName,program){
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
}