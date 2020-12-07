const express = require('express')
const app = express()
const port = 5000  
const mongoose = require('mongoose')


//bodyParser
const bodyParser = require('body-parser');
const cookieParaser = require('cookie-parser');

//User 객체
const { User } = require('./models/User.js');
const { auth } = require('./middleware/auth.js');

// db 관련
const config = require('./config/key');



//application/x-www-form-urlencoded 데이터를 분석할수 있게
app.use(bodyParser.urlencoded({extended:true}));
// application/json으로 가져오는 데이터를 분석할수 있게
app.use(bodyParser.json());
//쿠키 사용
app.use(cookieParaser());

//db관련
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true
    ,useUnifiedTopology:true
    ,useCreateIndex:true
    ,useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err)) // 에러 방지용으로 옵션 설정




// 라우트 (스프링 Controller 비슷)



//접속시 화면
app.get('/',(req,res) => res.send('안녕하세요'))  // 루트 디렉토리에 출력
//접속시 콘솔
app.listen(port, () => console.log(`Example app listening on port ${port}!`))



//가입
app.post('api/users/register',(req,res) => {
// 회원 가입 할때 필요한 정보들을 client에서 가져오면 
// 그것들을 데이터 베이스에 넣어준다.
    const user = new User(req.body)
    user.save((err,userInfo)  =>  {
        if(err) return res.json({success:false,err})
        return res.status(200).json({
            success:true
        })
     }) //mongodb의 함수 유저모델을 저장해준다.
})


//로그인 
app.post('/api/users/login',(req,res) => {

    // 요청된 이메일이 db 에 있는지 체크
    User.findOne({email:req.body.email },(err,user) => {
        if(!user){
            return res.json({loginSuccess:false,
            message:"제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
    //요청된 이메일이 db에 있을때 비밀번호 체크
      user.comparePassword(req.body.password,(err,isMatch)  => {
        if(!isMatch){
            return res.json({loginSuccess:false,message:"비밀번호가 틀렸습니다."})
        }
        //비밀번호까지 맞을시 토큰 생성
        user.generateToken((err,user) =>{
            if(err) return res.status(400).send(err);
            //토큰을 저장한다.  (쿠키 혹은 로컬스트리지)
            res.cookie("x_auth",user.token)
            .status(200)
            .json({loginSuccess:true,userId:user._id})

        })
      })      
    })   
    // 비밀번호가 일치할시 토큰 생성
})


//권한 확인
app.get('/api/uesrs/auth',auth,(req,res) => {

    // 이 로직을 타게된다는건 authentication이 true라는 것
    res.status(200).json({
    _id: req.user._id
    ,isAdmin: req.user.role === 0 ? false : true
    ,isAuth : true
    ,email:req.user.email
    ,name : req.user.name
    ,lastname : req.user.lastname
    ,role: req.user.role
    ,image: req.user.image
    })

})

//로그아웃
app.get('/api/users/logout',auth,(req,res) => {

    User.findOneAndUpdate(
        {_id:req.user._id},   // 아이디로 유저를 찾고
        {token:""},          //토큰을 지워줌
        (err,user) => {
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success:true
            })

        })

})







