const {spawn} = require("child_process");
module.exports = function createProject(projectName,program){
    const cwd = process.cwd();
    spawn(`vue create ${projectName}`)
}