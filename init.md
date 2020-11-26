### package.json添加bin字段，创建bin文件夹和main.js文件，指向bin/main
```
"bin":{
    "yj-service-cli":"main.js"
}
```

```
#!/usr/bin/env node  //首行添加，让系统动态的去PATH目录中查找node来执行你的脚本文件
```

```
npm link  //创建软链接至全局,可以全局使用yj-service-cli命令
```

### 安装依赖
```
npm install chalk commander download-git-repo inquirer ora --save
```