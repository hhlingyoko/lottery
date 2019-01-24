## 基于fis3的PC端项目示例配置及使用

## PC端主要实现功能
* 自动编译scss/sass预处理文件
* 自动为添加各移动端兼容前缀（autoprefixer）
* 自动压缩png图片，压缩合并js、css
* 部分node版本下支持合成雪碧图
* 支持js文件和css文件指纹功能，解决服务器强缓存问题
* 开发时自动刷新页面
* ajax模拟测试数据

---------------------------------------

## 完整配置及使用方法：

### 1. 安装新版本的node.js环境，支持的版本详见fis3官网


### 2. 由于npm网速不理想， 建议安装cnpm， 详细方法：https://npm.taobao.org/

* a.打开命令行（开始菜单搜索cmd）, 输入：

  ```cmd
    npm install -g cnpm --registry=https://registry.npm.taobao.org
  ```

* b.安装完成后以后npm的指令可以用cnpm代替执行

### 3. 安装fis3，安装方法：

* a. 安装fis3环境， 命令行执行：

  ```cmd
    cnpm install -g fis3
  ```

* b. 在项目根目录下执行下面的命令，安装`package.json`对应的npm依赖：

  ```cmd
    npm i
  ```

  亦可全局安装，方便以后使用。

### 3. fis-conf.js配置

若有特殊项目则可以自行修改配置文件fis-conf.js。


### 4.开始使用
* a.将该模板项目`clone`到本地。
* b. 执行以下命令，然后浏览器会默认自动打开127.0.0.1:8080，若没有则要自行打开。

  ```cmd
    npm run start
  ```

* c. 命令行执行开启自动同步刷新功能

  ```cmd
    npm run dev
  ```

* d. 使用模板前请将`index.html`及`index.js`或`app.js`文件中的示例代码手动清除


### 6. 编译测试包，当完成项目编码后，可以打测试包，放到线上测试环境中测试，测试包不会压缩代码、合并文件，以方便调试。

* a. 在命令行中进入到项目目录下。

* b. 命令行执行：
  ```cmd
    npm run test
  ```


### 7. 编译正式包，当测试通过后，可以打正式包，此时就会压缩代码、合并文件。

* a. 在命令行中进入到项目目录下。

* b. 命令行执行：
  ```cmd
    npm run dist
  ```


### 8.如果在线上遇到强缓存的情况，可以将配置文件中TEST_USE_HASH或FORMAL_USE_HASH置为true，开启文件指纹功能。


### 9.雪碧图使用：
在部分node版本下该功能可用。在css背景属性后添加`?__sprite`后缀即可自动合成雪碧图

```css
  .btn-share {
    background: url(../i/result-btn-share.png?__sprite);
  }
```

### 10.ajax数据模拟

由于活动型项目的接口一般都较少且简单，在后端完成正式接口前，可以使用mock静态数据即可满足需求。

a. 静态模拟数据
在`/mock`目录下创建一个返回数据的json文件(如下文的`userInfo.json`)，在`server.conf`文件下配置路由规则：

```config
  rewrite ^\/api\/user$ /mock/userInfo.json
```

当我们启动fis3服务器并`fis3 release -wL`后，即可访问`/api/user`接口地址获取数据。
一般我们把接口地址统一写在`index.html`下的`oPageConfig.oUrl`中，方便上线替换正式地址。

```javascript
    window.oPageConfig = {
      oUrl: {
        'getUserInfo': '/api/user',
      }
    }
```

That's it, try one try and have fun.

