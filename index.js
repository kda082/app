const express = require('express')
const app = express()
const port = 5000  
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://test:1234@sc.lakw3.mongodb.net/sc?retryWrites=true&w=majority',{
    useNewUrlParser: true
    ,useUnifiedTopology:true
    ,useCreateIndex:true
    ,useFindAndModify:false
}).then(() => console.log('MongoDB Connected...'))
   .catch(err => console.log(err)) // 에러 방지용으로 옵션 설정


app.get('/',(req,res) => res.send('안녕하세요'))  // 루트 디렉토리에 출력
app.listen(port, () => console.log(`Example app listening on port ${port}!`))




