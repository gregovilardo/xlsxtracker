import React, { useState, useEffect } from "react";
import { getUserToken } from "../helpers/getUserToken";
// import { getTrades } from "./helpers/getTrades";
import { createUser } from "../helpers/createUser";
import { useCurrentUser } from "./CurrentUserContext";
import { fetchTokens } from "../helpers/fetchTokens";

const url = process.env.BACK_END_URL || "http://localhost:8000";

function Register() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
        confirmation: "",
        error: "",
    });

    const { saveCurrentUser } = useCurrentUser();

    function handleChange(event) {
        const { name, value } = event.target;
        setUser((prevVal) => ({ ...prevVal, [name]: value }));
    }

    function handleSubmit(event) {
        if (user.password !== user.confirmation) {
            setUser({
                username: user.username,
                email: user.email,
                password: "",
                confirmation: "",
                error: "The passwords don't match",
            });
        } else {
            createUser(user.username, user.email, user.password, url)
                .then((res) => {
                    if (res.user) {
                        console.log(res);
                        try {
                            saveCurrentUser(
                                res.user.id,
                                res.user.username,
                                res.user.email
                            );
                        } catch (e) {
                            return e;
                        }
                    } else if (res.username) {
                        setUser({
                            username: "",
                            password: "",
                            error: res.username,
                        });
                        console.log(res);
                    } else {
                        setUser({
                            username: "",
                            password: "",
                            error: "Something went wrong, try again!",
                        });
                        console.log(res);
                    }
                })
                .catch((e) => {
                    return new Error(e);
                });
        }
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="username"
                        value={user.username}
                        placeholder="Username"
                    />
                </div>
                <div>
                    <input
                        type="email"
                        onChange={handleChange}
                        name="email"
                        value={user.email}
                        placeholder="Email"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={user.password}
                        placeholder="Password"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        onChange={handleChange}
                        name="confirmation"
                        value={user.confirmation}
                        placeholder="Confirm your password"
                    />
                </div>
                <div className="error-login">{user.error}</div>
                <button class="btn-blue auth">Sign Up</button>
            </form>
        </div>
    );
}

function LogIn() {
    const [user, setUser] = useState({
        username: "",
        password: "",
        error: "",
    });

    const { saveCurrentUser } = useCurrentUser();

    function handleChange(event) {
        const { name, value } = event.target;
        setUser((prevVal) => ({ ...prevVal, [name]: value }));
    }

    function handleSubmit(event) {
        getUserToken(user.username, user.password, url)
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        try {
                            saveCurrentUser(
                                data.user.id,
                                data.user.username,
                                data.user.email
                            );
                        } catch (e) {
                            return e;
                        }
                    });
                } else {
                    setUser({
                        username: "",
                        password: "",
                        error: "Something went wrong, try again!",
                    });
                    console.log("Error: ", res);
                }
                // if (res.access){
                //     console.log("Succesfully loged in");
                //     console.log(res)
                //     // This saveCurrentUser is to set a context var(user)
                //     saveCurrentUser(
                //         res.user.id,
                //         res.access,
                //         res.refresh,
                //         res.user.username,
                //         res.user.email
                //     );
                // } else {
                //     let error
                //     res.non_field_errors[0] ? error = res.non_field_errors[0] : error = "Something went wrong, try again!"
                //     setUser({
                //         username: "",
                //         password: "",
                //         error: error,
                //     });
                //     console.log("Error: ", res);
                // }
            })
            .catch((e) => {
                console.log(e);
                return new Error(e);
            });
        event.preventDefault();
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="text"
                        onChange={handleChange}
                        name="username"
                        value={user.username}
                        placeholder="Username"
                    />
                </div>
                <div>
                    <input
                        type="password"
                        onChange={handleChange}
                        name="password"
                        value={user.password}
                        placeholder="Password"
                    />
                </div>
                <div className="error-login">{user.error}</div>
                <button class="btn-blue auth">Login</button>
            </form>
        </div>
    );
}

function Auth() {
    const [comp, setComp] = useState({
        register: true,
        login: false,
    });

    const { saveCurrentUser } = useCurrentUser();

    useEffect(() => {
        fetchTokens(url)
            .then((res) => {
                if (res.status === 200) {
                    res.json().then((data) => {
                        try {
                            saveCurrentUser(
                                data.user.id,
                                data.user.username,
                                data.user.email
                            );
                        } catch (e) {
                            return e;
                        }
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    });

    function showComp() {
        comp.register
            ? setComp({
                  register: false,
                  login: true,
              })
            : setComp({
                  register: true,
                  login: false,
              });
    }

    if (comp.register) {
        return (
            <div>
                <div className="container-auth">
                    <Register />
                    <div className="textauth">
                        you alreay have an account?{" "}
                        <button onClick={showComp}>Login</button>
                    </div>
                </div>
            </div>
        );
    } else {
        return (
            <div>
                <div className="container-auth">
                    <LogIn />
                    <div className="textauth">
                        you don't have an account?{" "}
                        <button onClick={showComp}>Register</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Auth;
