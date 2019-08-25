const http = require('http');
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');
let server = http.createServer(function(req,res){
    // 检测文件夹是否存在，不存在则创建
    try{
        let hasDir = fs.statSync(path.join(__dirname,'upload'));
        
    }catch(e){
        fs.mkdirSync(path.join(__dirname,'upload'),function(error){
            console.log('创建目录成功');
            if(error){
                console.log(error);
                return false;
            }
        });
    }
    let config = {
        uploadDir:'./upload'
    }
    let form = new multiparty.Form(config);
    // 获取文件方式1
    // form.parse(req,function(err,fields,files){
    //     if(!err){
    //         res.writeHead(200, {'content-type': 'text/plain'});
    //         console.log(fields)
    //         console.log(files)
    //     }else{
    //         console.log(err);
    //     }
    // });
    form.parse(req);
    // 获取文件方式2
    form.on('field',(name,value)=>{
        console.log(name,value)
    });
    form.on('file',(name,file)=>{
        console.log(name,file)
    });
    form.on('close',function(){
        console.log('上传成功')
    });
}).listen(5000);