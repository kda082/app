import { combineReducers } from 'redux';
import user from './user_reducer';



//combineReducers를 이용해서 rootReducer로 합쳐준다
const rootReducer = combineReducers({
    user
})


export default rootReducer;