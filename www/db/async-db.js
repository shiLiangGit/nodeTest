const http = require('http');
const url = require('url');
const fs=require('fs');
const path = require('path');
const DB = require('./dbPromise');
const validate = require('../lib/validate');
http.createServer(async(req,res) => {
    const {pathname,query} = url.parse(req.url,true);
     //这里指定编码，处理乱码的问题
     res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
    if(pathname == '/register'){
        let {username,password} = query;
        let errName = validate.checkUserName(username);
        let errPwd = validate.checkPassword(password);
        if(errName){
            console.log(errName)
            res.write(errName);
            res.end();
            return false;
        }
        if(errPwd){
            res.write(errPwd);
            res.end();
            return false;
        }
        let [err,data] = await DB.to(DB.db(`SELECT id FROM user_table WHERE username=?`,[`${username}`]));
            if(err){
                console.log(err);
                res.write('查询失败');
            }else if(data.length > 0){
                res.write('此用户名已存在');
            }else {
                await DB.to(DB.db(`SELECT id FROM user_table WHERE username=?`,[`${username}`]))
                let [err,data] = await DB.to(DB.db(`INSERT INTO user_table (username,password) VALUES(?,?)`,[`${username}`,`${password}`]));
                if(err){
                    console.log(err)
                    res.write('注册失败');
                }else{
                    res.write('注册成功');
                }
            }
            res.end();
    }else if(pathname == '/login'){
        let {username,password} = query;
        let errName = validate.checkUserName(username);
        let errPwd = validate.checkPassword(password);
        if(errName){
            res.write(errName);
            res.end();
            return false;
        }
        if(errPwd){
            res.write(errPwd);
            res.end();
            return false;
        }
        let [err,data] = await DB.to(DB.db(`SELECT id,password FROM user_table WHERE username=${username}`));
        if(err){
            res.write('查询失败');
        }else{
            let info = JSON.parse(JSON.stringify(data))
            if(info.length > 0){
                if(info[0].password != password){
                    res.write('密码不正确');
                }else{
                    res.write('登录成功');
                }
            }else{
                res.write('用户不存在');
            }
        }
        res.end();   
    }else{
        res.writeHead(200,{'Content-Type':'text/html'});
        fs.readFile(path.resolve(__dirname,'.' + pathname), (err, buffer)=>{
          if(err){
            res.writeHeader(404);
            res.write('not found');
          }else{
            res.write(buffer);
          }
          res.end();
        });
      }
}).listen(8080);
