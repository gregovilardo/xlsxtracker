import { useState } from "react";
import { useCurrentUser } from "./CurrentUserContext";

const IsLogin = () => {
    const [isLogin, setIsLogin] = useState(false)

    const { currentUser, saveCurrentUser } = useCurrentUser();
    if (currentUser.token) {
        setIsLogin(true)
    } else {
        setIsLogin(false)
    }
    console.log(currentUser);
}

export default IsLogin