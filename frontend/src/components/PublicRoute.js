// import React, {useState} from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCurrentUser } from './CurrentUserContext';

const PublicRoute = ({component: Component, restricted, ...rest}) => {
    // const [login, setLogin] = useState(false)
    
    const { currentUser } = useCurrentUser();
    function isLogin(){
        if (currentUser.id) {
            return true
        } else {
            return false
        }
    }

    //if its restricted is going to redirect you to the home page once you loged in
    return (
        // restricted = false meaning public route
        // restricted = true meaning restricted route
        <Route {...rest} render={props => (
            isLogin() && restricted ?
                <Redirect to="/" />
            : <Component {...props} />
        )} />
    );
};

export default PublicRoute;