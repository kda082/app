const express = require('express')
const app = express()
const port = 5000  
const mongoose = require('mongoose')


const bodyParser = require('body-parser');
const { User } = require('./models/User.js');


const config = require('./config/key');


//application/x-www-form-urlencoded 데이터를 분석할수 있게
app.use(bodyParser.urlencoded({extended:true}));

// application/json으로 가져오는 데이터를 분석할수 있게
app.use(bodyParser.json());


mongoose.connect(config.mongoURI,{
    useNewUrlParser: true
    ,useUnifiedTopology:true
    ,useCreateIndex:true
    ,useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err)) // 에러 방지용으로 옵션 설정


app.get('/',(req,res) => res.send('안녕하세요'))  // 루트 디렉토리에 출력


// 회원 가입을 위한 route 만들다

app.post('/register',(req,res) => {

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


app.listen(port, () => console.log(`Example app listening on port ${port}!`))






