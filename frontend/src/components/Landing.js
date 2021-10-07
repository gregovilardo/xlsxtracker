import { useState } from "react";
import Auth from "./Auth";
import Footer from "./Footer";

export default function Landing() {
    const [showStart, setLucky] = useState("transition ocult");
    const [text, setText] = useState("transition ocult");
    const [auth, setAuth] = useState("transition ocult");

    const handleClick = (e) => {
        if (e.target.value === "yes") {
            setLucky("transition");
            document.querySelector("#no").disabled = true;
            document.querySelector("#no").style.border = "1px solid grey";
            document.querySelector("#no").style.background = "rgb(14, 14, 14)";
            setText("transition ocult")
        }
        if (e.target.value === "no") {
            setText("transition");
        }
        if (e.target.value === "start") {
            setAuth("transition");
        }
    };

    return (
        <div>
            <div class="page-wrap">
                <div className="landing">
                    <div className="left">
                        <div className="tired">
                            Tired of the mess that binance passes off as order
                            history ?
                        </div>
                        <div className="yes-no">
                            <button
                                value="yes"
                                className="btn-blue-outline"
                                onClick={handleClick}
                            >
                                Yes
                            </button>
                            <button
                                value="no"
                                id="no"
                                className="btn-blue-outline"
                                onClick={handleClick}
                            >
                                No
                            </button>
                            <p className={text}>I advice you to click "Yes"</p>
                        </div>
                        <div className={showStart}>
                            <div className="lucky ">
                                Well if that is the case, this is your lucky
                                day! In this website you have the superpower to{" "}
                                <text>convert</text> the boring and troubeling{" "}
                                <text>excel</text> sheet in{" "}
                                <text>statistics for humans</text>.
                            </div>
                            <div className="getstarted">
                                <a href="#form">
                                <button
                                    value="start"
                                    className="btn-blue"
                                    onClick={handleClick}
                                >
                                    Get started!
                                </button>
                                </a>
                                
                            </div>
                        </div>
                    </div>
                    <div id="form" className="right">
                        <div className={auth}>
                            <div class="comeon">
                                COME ON, START MANAGING YOUR TRADES
                            </div>
                            <Auth />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
