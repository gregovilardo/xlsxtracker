import { useEffect, useState } from "react";
import React from "react-dom";
import { getTracker } from "../helpers/getTracker";
import { useCurrentUser } from "./CurrentUserContext";
import Footer from "./Footer";
import NavBar from "./NavBar";

const url = process.env.BACK_END_URL || "http://localhost:8000";

function Holds() {
    const [holds, setHolds] = useState([]);
    const { currentUser } = useCurrentUser();

    useEffect(() => {
        setHolds([]);
        const fetchHolds = async () => {
            try {
                const response = await getTracker("holds", url);
                response.json().then((data) => {
                    console.log(data);
                    try {
                        data.forEach((hold) => {
                            hold.pair = hold.pair.substring(0, hold.pair.length-4)
                            var avg = 1 / hold.price;
                            if (avg < 0.1) {
                                var regex = /0+/g;
                                var list_regex = avg.toString().match(regex);
                                hold.round = list_regex[1].length + 2;
                                // the above code is to know how much decimald the hold need
                            }
                            hold.percentage = (
                                ((hold.price - hold.start_price) /
                                    hold.start_price) *
                                100
                            ).toFixed(2);
                            hold.percentage > 0
                                ? (hold.color = "profit")
                                : (hold.color = "loss");

                            hold.start_date = hold.start_date.substring(0, 10);
                            // (date.replace("T", " ").replace("Z", "")) for details of the trade
                            setHolds((prevHold) => [...prevHold, hold]);
                        });
                    } catch (e) {
                        console.log(e);
                    }
                });
            } catch (e) {
                console.log(e);
            }
        };
        fetchHolds();
        // i disable the props.url warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    return (
        <div className="trades">
            <div className="page-wrap">
                <NavBar />

                <div class="section">
                    <div className="title">Holds</div>
                    <div className="table">
                        <table cellSpacing="0">
                            <tr>
                                <th align="center">Pair</th>
                                <th align="center" className="date">
                                    Start
                                </th>
                                <th align="center" className="holding">
                                    Holding
                                </th>
                                <th align="center" className="price-hold">
                                    Price
                                </th>
                                <th align="right" className="total">
                                    TotalUSD
                                </th>
                                <th align="right" className="prctg-hold">
                                    Percentage
                                </th>
                            </tr>

                            {holds.map((hold) => {
                                return (
                                    <tr key={hold.id}>
                                        <td align="center" className="pair">
                                            <img
                                                width="30px"
                                                height="30px"
                                                src={hold.logo}
                                                alt="coin logo"
                                            />
                                            {hold.pair}
                                        </td>
                                        <td align="center" className="date">
                                            {hold.start_date}
                                        </td>
                                        <td align="right" className="holding">
                                            {hold.holding.toFixed(hold.round)}
                                        </td>
                                        <td
                                            align="right"
                                            className="price-hold"
                                        >
                                            ${parseFloat(hold.price).toFixed(2)}
                                        </td>
                                        <td
                                            align="right"
                                            className={hold.color}
                                        >
                                            $
                                            {(
                                                hold.holding * hold.price
                                            ).toFixed(2)}
                                        </td>

                                        <td
                                            align="right"
                                            id="prctg-hold"
                                            className={hold.color}
                                        >
                                            {hold.percentage}%
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Holds;
