// import React, { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCurrentUser } from "./CurrentUserContext";


const PrivateRoute = ({component: Component, ...rest}) => {
    // const [login, setLogin] = useState(false)
    
    const { currentUser } = useCurrentUser();
    function isLogin(){
        if (currentUser.id) {
            return (true)
        } else {
            return (false)
        }
    }

    return (

        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
        <Route {...rest} render={props => (
            isLogin() ?
                <Component {...props} />
            : <Redirect to="/auth" />
        )} />
    );
};

export default PrivateRoute;