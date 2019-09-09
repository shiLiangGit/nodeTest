const db = require('./libs/database');
const http=require('./libs/http');
const {addRouter}=require('./libs/router');
addRouter('get','/aaa',async (res)=>{
    console.log(2323232)
    res.write('2323232');
    res.end();
});