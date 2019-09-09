const http = require('http');
const fs = require('fs');
const url = require('url');
const queryString = require('querystring');
const gzip = require('gzip');
const {Form} = require('multiparty');
const {HTTP_PORT,HTTP_ROOT,HTTP_UPLOAD} = require('../config');
const router = require('./router');

http.createServer((req,res)=>{
    res.writeJson=function (json){
        res.setHeader('content-type', 'application/json');
        res.write(JSON.stringify(json));
      };


    let {pathname,query} = url.parse(req.url,true);
    if(req.method == 'POST'){
        if(req.headers['content-type'].startsWith('application/x-www-form-urlencoded')){
            // 普通post请求
            let arr = [];
            req.on('data',buffer=>{
                arr.push(buffer);
            });
            req.on('end',()=>{
                let post = queryString.parse(Buffer.concat(arr).toString());
                // 找路由
                handle(req.method, pathname, query, {}, {});
            });
        }else{
            let form = new Form({
                uploadDir:HTTP_UPLOAD
            });
            let post = {};
            let files = {};
            form.on('field',(name,value)=>{
                post[name] = value;
            });
            form.on('files',(file,value)=>{
                files[file] = value;
            });
            form.on('error',err=>{
                console.log(err)
            });
            form.on('close',()=>{
                // 找路由
                handle(req.method, pathname, query, post, files);
            });
        }
    }else{
        //2.找路由
        handle(req.method, pathname, query, {}, {});
    }
    async function handle(method, url, get, post, files){
        let fn=router.findRouter(method, url);
        if(!fn){
            //文件
            let filepath=HTTP_ROOT+pathname;
            fs.stat(filepath, (err, stat)=>{
                if(err){
                res.writeHeader(404);
                res.write('Not Found');
                res.end();
                }else{
                let rs=fs.createReadStream(filepath);
                let gz=zlib.createGzip();
                rs.on('error', ()=>{});
                res.setHeader('content-encoding', 'gzip');
                rs.pipe(gz).pipe(res);
                }
            });
        }else{
            //接口
            try{
                await fn(res, get, post, files);
            }catch(e){
                console.log(e);
                res.writeHeader(500);
                res.write('Internal Server Error');
                res.end();
            }
        }
    }
}).listen(HTTP_PORT);
console.log(`服务已启动${HTTP_PORT}`);
