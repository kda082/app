const mongoose = require('mongoose');


//스키마 생성
const userSchema = mongoose.Schema({
    nmae : {
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, // 공백제거
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

// 스키마를 모델로 감싸준다.
const User = mongoose.model('User',userSchema)  ;  //모델이름,스키마

// 모델을 외부파일에서도 쓸 수 있게 module.exports

module.exports = {
    User
};