import React,{ useState } from 'react'
import {useDispatch} from 'react-redux';
import {loginUser} from '../../../_actions/user_action';

function LoginPage(props) {

  const dispatch = useDispatch();

    // state 관리

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) =>{
        setEmail(event.currentTarget.value)
    }
    const onPasswordHandler = (event) =>{
        setPassword(event.currentTarget.value)
    }


    const onSubmitHandler = (event) => {
        event.preventDefault(); // page refresh를 막는다.

        let body = {
            email :Email,
            password:Password
        }
  
        dispatch(loginUser(body))
        .then(response =>{
            if(response.payload.loginSuccess){
                props.history.push('/') //리액트에서 페이지 이동시 사용함 
            }else{
                alert('Error')
            }
        })
     
    }


    return (
        <div style={{
            display:'flex', 
            justifyContent:'center',
            alignItems:'center',
            width:'100%',
             height:'100vh'      
        }}>
            <form style={{display:'flex',flexDirection:'column'}}
            onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button >
                    login
                </button>

            </form>
        </div>
    )
}

export default LoginPage
