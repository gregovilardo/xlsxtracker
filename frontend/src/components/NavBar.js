import { useState } from "react";
import userSvg from "../svg/user-svg.svg"
import { Link } from "react-router-dom";
import logOut from "../helpers/logOut"


const url = process.env.BACK_END_URL || "http://localhost:8000";

function NavBar() {
    const [cls, setCls] = useState({
        nav: "nav-menu",
        ham: "hamburger",
        b1: "bar",
        b2: "bar",
        b3: "bar",
    });

    function mobileMenu() {
        if (cls.nav === "nav-menu") {
            setCls({
                nav: "nav-menu active",
                ham: "hamburger active",
                b1: "bar b1",
                b2: "bar b2",
                b3: "bar b3",
            });
        } else {
            setCls({
                nav: "nav-menu",
                ham: "hamburger",
                bar: "bar",
                b1: "bar",
                b2: "bar",
                b3: "bar",
            });
        }
    }

    function handleClick(){
        logOut(url).then(r => {
            console.log(r);
        }).catch(e=>{console.log(e);})
        setTimeout(()=>{window.location.reload();}, 100)
        
    }
    

    // const navLink = document.querySelectorAll(".nav-link");

    // navLink.forEach(n => n.addEventListener("click", closeMenu));

    return (
        <header className="header">
            <nav className="navbar">
                <ul className={cls.nav}>
                    <div className="nav-item-container">
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                Home
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/trades" className="nav-link">
                                Trades
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/holds" className="nav-link">
                                Holds
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/trades_on_hold" className="nav-link">
                                Trades on hold
                            </Link>
                        </li>
                    </div>
                    <div className="nav-item-container">
                        <li className="nav-item">
                            <Link to="#" className="nav-link">
                                <img
                                    width="35px"
                                    height="35px"
                                    src={userSvg}
                                    alt="img for user profile"
                                />
                            </Link>
                        </li>
                        <li className="nav-item">

                            <button onClick={handleClick}>Log Out</button>
                        </li>
                    </div>
                </ul>
                <div
                    onClick={() => {
                        mobileMenu();
                    }}
                    className={cls.ham}
                >
                    <span className={cls.b1}></span>
                    <span className={cls.b2}></span>
                    <span className={cls.b3}></span>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;
