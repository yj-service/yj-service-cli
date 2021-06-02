const fs = require('fs');
const path = require('path');
const http = require('http');
const compressing = require('compressing')
const choices = [ 
    {key:"test",url:"http://yjhihis-test.yjhealth.cn/yj-consult-front/yjConsult.zip",name:"测试"},
    {key:"pre",url:"",name:"预发布"},
    {key:"master",url:"",name:"正式"}
];

module.exports = function getConsultPackage(){
    const inquirer = require('inquirer')
    inquirer.prompt([
        {
            type:"list",
            message:"选择咨询分包？",
            name:"env",
            default:0,
            choices:choices.map(item=>item.name)
        }
    ]).then(answers=>{
        const env = choices.filter(item=>item.name == answers.env)[0]
        http.get(env.url,(res)=>{
            const filename = env.url.substring(env.url.lastIndexOf('/'));
            const current = process.cwd();
            const writestream = fs.createWriteStream(`${current}/${filename}`);
            res.pipe(writestream);
            writestream.on('finish',()=>{
                const zipPath  = path.join(current,filename);
                compressing.zip.uncompress(zipPath,'./').then((res)=>{ 
                    console.log('解压成功'); 
                    fs.unlinkSync(zipPath);
                })
            })
        })
    }).catch(error=>{
       console.error(error)
    })
}


