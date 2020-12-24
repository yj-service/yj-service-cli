### install nrm package to switch registry
```
npm install -g nrm
nrm add <registry> <url>  //add registry eg:nrm add yj http://registry.yjhealth.cn
nrm use <registry>        //use registry eg:nrm use yj
npm adduser               //adduser in registry
```

### if not use nrm you can set private registry and adduser like this
```
npm set registry http://registry.yjhealth.cn
npm adduser --registry http://registry.yjhealth.cn
```

### create a new project by vue-cli
```
npm install -g @vue/cli
vue create <project-Name>    
```

### install yj-service-cli and lerna global 
```
nrm use <registry> or npm set registry http://registry.yjhealth.cn
npm install yj-service-cli -g  
npm i -g lerna
```

### for first create project use,rebuild project,add vuepress and lerna.json vue.config.js  
```
yj-service-cli init
```

### add a new service in the packages folder
```
yj-service-cli add <service-name>
```

### install service dependencies
```
lerna add <package>[@version] [--dev]
lerna add <package>[@version] --scope=<service-name>
```

### remove module dependencies 
```
lerna exec -- yarn remove <package>
lerna exec -- npm uninstall <package>
lerna exec --scope=<service-name> yarn remove <package>
lerna exec --scope=<service-name> npm uninstall <package>
```


### publish a service
```
npm login
lerna publish [from-git/from-package]
```

### unpublish a existed service
```
npm unpublish <service-name> [--force]
```

### build production
```
npm run build     //build all services
npm run build [service-name]   //build one service
```

### run serve when development env
```
npm run serve:[env] --service=[service-name]
```


### git version must >2.13.0

### add emoji when git commit
[https://blog.csdn.net/jackiedyh/article/details/109309743](https://blog.csdn.net/jackiedyh/article/details/109309743)
