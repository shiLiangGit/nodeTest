const mysql = require('mysql');

let config = {
    host:'localhost',
    port:3306,
    user:'root',
    passwor:'',
    database:'node'
}
let pool = mysql.createPool(config);

let db = (sql,values)=>{
    return new Promise((resolve,reject)=>{
        pool.getConnection((err,connect)=>{
            if(err){
                reject(err);
            }else{
                connect.query(sql,values,(err,data)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(data);
                    }
                });
            }
        });
    });
}
let to = (promise) => {
    if(!promise || !Promise.prototype.isPrototypeOf(promise)){
        return new Promise((resolve, reject)=>{
            reject(new Error("requires promises as the param"));
        }).catch((err)=>{
            return [err, null];
        });
    }
    return promise.then(function(){
        return [null, ...arguments];
    }).catch(err => {
        return [err, null];
    });
 };
module.exports = {
    db,
    to
};