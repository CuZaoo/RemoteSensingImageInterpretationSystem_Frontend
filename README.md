
# 遥感图像自动解译网站 前端
## 使用的前端模板
ELADMIN 前端：https://github.com/elunez/eladmin-web


#### Build Setup
``` bash
# 1.安装Node和npm环境

# 2.安装依赖
2.1.使用IDEA等开发软件导入项目
2.2.打开终端，定位到项目主目录下
2.3.终端运行命令,安装项目使用包: npm install

# 3.启动项目 localhost:8013
终端运行命令: npm run dev

# 4.构建生产环境
4.0.注意修改 .env.production文件
4.1.终端运行命令:npm run build:prod
4.2.项目目录下出现 dict 文件夹
4.3.将 dict 文件夹 拷贝到对应部署服务器

# 5.使用nginx部署
5.1.ubuntu服务器安装nginx（浏览器搜索 ubuntu安装nginx 或 进入此链接 https://www.cnblogs.com/fengkun125/p/14142912.html/
5.2.进入对应/etc/nginx/conf.d目录下新建(vim)yg.conf文件
5.3.输入以下配置并修改server_name 和 root
server{
    listen 80;
    server_name 域名/外网IP;
    index index.html;
    root  dist上传的路径
    # 避免访问出现 404 错误
    location / {
      try_files $uri $uri/ @router;
      index  index.html;
    }
    location @router {
      rewrite ^.*$ /index.html last;
    }  
} 
5.4.重启nginx（service nginx restart）
5.5.前端部署完成
```

#### 常见问题

1、linux 系统在安装依赖的时候会出现 node-sass 无法安装的问题

解决方案：
```
1. 单独安装：npm install --unsafe-perm node-sass 
2. 直接使用：npm install --unsafe-perm
```

2、加速node-sass安装

https://www.ydyno.com/archives/1219.html

