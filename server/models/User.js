const mongoose = require('mongoose');

// bcrypt 암호화
const bcrypt = require('bcrypt');
const saltRounds = 10;
// 토큰
const jwt = require('jsonwebtoken');

//스키마 생성
const userSchema = mongoose.Schema({
    name : {
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // 공백제거
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type: String,
        maxlength: 50
    },
    role:{
        type: Number,
        default: 0
    },
    image:String,
    token: {
        type:String
    },
    tokenExp:{  //토큰 유효기간
        type:Number
    }
})


// pre  지정한 함수가 실행되기전 먼저 실행되는 스키마 함수  
userSchema.pre('save',function(next){
  var user = this;
    if(user.isModified('password')){   //비밀번호 수정시에만 암호화 로직을 타게
        //비밀번호 암호화 시킨다.
        bcrypt.genSalt(saltRounds,function(err,salt){
            if(err) return next(err)
            bcrypt.hash(user.password,salt,function(err,hash){
            if(err) return next(err)
            user.password = hash;
            next()

            })
        })
    }else{
        next()
    }
})


// 비밀번호 체크 메서드
userSchema.methods.comparePassword = function (plainPassword,cb){
    //plainPassword 우리가 입력한 암호와 db에 있는 암호가 맞는지 체크
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err){
            return cb(err)
        }
        cb(null,isMatch)
    })
}

//토큰 생성 메서드
userSchema.methods.generateToken = function (cb){
    var user = this;

    //jsonwebtoken을 이용해서 token을 생성하기 
    var token = jwt.sign(user._id.toHexString(),'secretToken')
    user.token = token
    user.save(function(err,user){
        if(err) return cb(err)
        cb(null,user)
    })

}

// 유저 토큰 찾기
userSchema.statics.findByToken = function (token,cb){
    var user = this;

    //토큰을 디코드한다.
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({"_id":decoded,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })

          
    })
}




// 스키마를 모델로 감싸준다.
const User = mongoose.model('User',userSchema)  ;  //모델이름,스키마

// 모델을 외부파일에서도 쓸 수 있게 module.exports
module.exports = { User };