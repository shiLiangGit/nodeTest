const http = require('http');
const mysql = require('mysql');
const url = require('url');
const fs=require('fs');
const path = require('path');
let db = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'root',
    password:'',
    database:'node'
});
http.createServer((req,res) => {
    const {pathname,query} = url.parse(req.url,true);
     //这里指定编码，处理乱码的问题
     res.writeHead(200, {'Content-Type': 'text/plain;charset=utf-8'});
    if(pathname == '/register'){
        let {username,password} = query;
        if(!username || !password){
            res.write('用户名或密码不能为空！');
            res.end();
        }else if(username.length > 32){
            res.write('用户名最大32个字！');
            res.end();
        }else if(password.length > 12){
            res.write('密码最大32个字！');
            res.end();
        }else{
            db.query(`SELECT id FROM user_table WHERE username=${username}`, (err,data) => {
                if(err){
                    console.log(err)
                    res.write('数据库连接有误1');
                    res.end();
                }else if(data.length > 0){
                    res.write('此用户名已存在');
                    res.end();
                }else {
                    db.query(`INSERT INTO user_table (username,password) VALUES('${username}','${password}')`,(err,data) => {
                        if(err){
                            res.write('数据库连接有误2');
                            res.end();
                        }else{
                            res.write('注册成功');
                            res.end();
                        }
                    });
                }
            });
        }
    }else if(pathname == '/login'){
        let {username,password} = query;
        if(!username || !password){
            res.write('用户名或密码不能为空！');
            res.end();
        }else{
            db.query(`SELECT id,password FROM user_table WHERE username=${username}`,(err,data)=>{
                if(err){
                    res.write('数据库连接有误2');
                    res.end();
                }else{
                    let info = JSON.parse(JSON.stringify(data))
                    if(info.length > 0){
                        if(info[0].password != password){
                            res.write('密码不正确');
                            res.end();   
                        }else{
                            res.write('登录成功');
                            res.end();
                        }
                    }else{
                        res.write('用户不存在');
                        res.end();   
                    }
                }
            });
        }
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
