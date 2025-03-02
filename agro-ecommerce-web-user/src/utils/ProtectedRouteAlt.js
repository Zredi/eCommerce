import React from 'react';
import { Route, Navigate  } from 'react-router-dom';
import {useSelector} from 'react-redux';


function ProtectedRouteAlt({redirectTo, ...rest}) {
    const {authData } = useSelector(state=>state.auth);
    if(authData && authData.jwt){
        return <Route {...rest}/>
    }else{
        return <Navigate to={redirectTo}/>
    }
}

export default ProtectedRouteAlt;
