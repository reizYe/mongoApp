var express = require('express');
var router = express.Router();
var User = require('../models/User'); // 引入模型
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
// 创建账号接口
router.post('/createAccount', (req, res) => {
  // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
  let newAccount = new User({
    account: req.body.account,
    password: req.body.password
  })
  //查询该账号是否已经被注册
  User.count({"account": newAccount.account },(err,docs) => {
    if(err) {
      console.log("Error:" + err)
      res.send(err)
    }else {
      //console.log("Docs:" + docs)
      if(docs>=1){
        //账号已经被注册，注册失败，返回code = 2
        console.log("注册失败")
        res.send({code:2,msg:'账号已经存在了，不能再次注册'})
      }else{
        // 账号未注册,保存数据newAccount数据进mongoDB，注册成功,返回code=1
        newAccount.save((err, data) => {
          //console.log('set')
          if (err) {
            res.send(err)
          } else {
            console.log("注册成功")
            res.send({code:1,msg:'恭喜您，账号创建成功了'})
          }
        })
      }
    }
  })
});

// 登录接口
router.post('/loginAccount', (req, res) => {
  // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
  let newAccount = new User({
    account: req.body.account,
    password: req.body.password
  })
  console.log("login:" + req.body.account)
  console.log(newAccount)
 //查询该账号是否存在
 User.findOne({"account": req.body.account},(err,docs) => {
    if(err) {
      console.log("Error:" + err)
      res.send(err)
    }else {
      console.log("Docs:" + docs)
      if(!docs == ""){
        // 若存在，再验证账号密码是否正确
        //console.log('该验证账号和密码是否正确了')
        if(docs.account === newAccount.account && docs.password === newAccount.password ){
          // 登录成功，返回code = 1
          console.log('登录成功')
          //可以使用 util.inspect 代替 JSON.stringify
          //res.send(util.inspect(res,{depth:null}))
          res.send({code:1,msg:'恭喜你，登录成功了'})
        }else {
          // 登录失败，密码错误，返回code = -1
          console.log({status:'登录失败', msg :'密码错误'})
          res.send({code:-1,msg:'密码错误，请重新输入'})
        }
      }else{
        // 若不存在，登录失败，返回code = -2
        console.log({status:'登录失败', msg :'账号不存在'})
        res.send({code:-2,msg:'账号不存在，请先注册账号'})
      }
    }
  })
});


module.exports = router;