//路由表
let router={
    // 格式如下
    // get:{
    //     '/':function(){

    //     }
    // }
};
// 添加路由
function addRouter(method, url, fn){
  method = method.toLowerCase();
  url = url.toLowerCase();
  router[method] = router[method] || {};
  router[method][url] = fn;
}
// 寻找路由
function findRouter(method, url){
  method = method.toLowerCase();
  url = url.toLowerCase();
  if(!router[method] || !router[method][url]){
    return null;
  }else{
      return router[method][url];
  }
}

module.exports={
  addRouter, findRouter
};
