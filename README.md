### create a new project by vue-cli
```
vue create <project-Name>    
```

### set private registry and adduser
```
npm set registry http://yjsinopia.yjhealth.cn
npm adduser --registry http://yjsinopia.yjhealth.cn
```

### switch registry
```
npm install -g nrm
nrm add <registry> <url>  //add registry
nrm use <registry>        //use registry
```


### install yj-service-cli and lerna global 
```
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
lerna publish
```

### unpublish a existed service
```
npm unpublish <service-name> [--force]
```
