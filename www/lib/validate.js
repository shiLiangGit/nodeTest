let checkUserName = (name) => {
    if(!name){
        console.log(56565)
        return '用户名不能为空';
    }else if(name.length > 32){
        return '用户名最长为32位';
    }else{
        return null;
    }
}
let checkPassword = (password) => {
    if(!password){
        return '密码不能为空';
    }else if(!/^\w{4,32}$/.test(password)){
        return '密码格式不对';
    }else{
        return null;
    }
}

module.exports = {
    checkUserName,
    checkPassword
}