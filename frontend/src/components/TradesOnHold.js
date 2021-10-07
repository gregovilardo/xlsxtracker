import { useEffect, useState } from "react";
import React from "react-dom";
import { getTracker } from "../helpers/getTracker";
import { useCurrentUser } from "./CurrentUserContext";
import Footer from "./Footer";
import NavBar from "./NavBar";

const url = process.env.BACK_END_URL || "http://localhost:8000";

function TradesOnHold() {
    const [trades_on_hold, setTradesOnHold] = useState([]);
    const { currentUser } = useCurrentUser();

 

    useEffect(() => {
        setTradesOnHold([]);
        const fetchTradesOnHold = async () => {
            try {
                const response = await getTracker(
                    "trades_on_hold",
                    url
                );
                response.json().then(data=>{
                    console.log(data);
                    try {
                        data.forEach((trades_on_hold) => {
                            trades_on_hold.date = trades_on_hold.date.substring(
                                0,
                                10
                            );
                            trades_on_hold.profit_loss > 0 ? trades_on_hold.color = "profit" : trades_on_hold.color = "loss"
    
                            // (date.replace("T", " ").replace("Z", "")) for details of the trade
                            setTradesOnHold((prevTrade_on_hold) => [
                                ...prevTrade_on_hold,
                                trades_on_hold,
                            ]);
                        });
                    } catch(e) {
                        console.log(e);
                    }
                })
            } catch (e) {
                console.log(e);
            }
        };
        fetchTradesOnHold();
        // i disable the props.url warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser]);

    console.log(trades_on_hold);

    return (
        <div className="trades">
            <div className="page-wrap">
                <NavBar />
                <div class="section">
                    <div className="title">Trades on Hold</div>
                    <div className="table">
                        <table cellSpacing="0">
                            <tr>
                                <th align="center" >
                                    Pair
                                </th>
                                <th align="center" className="date">
                                    Date
                                </th>
                                <th align="right" className="p-l">
                                    Profit/Loss
                                </th>
                                <th align="right" className="prctg">
                                    Percentage
                                </th>
                            </tr>

                            {trades_on_hold.map((trade) => {
                                return (
                                    <tr key={trade.id}>
                                        <td align="center" className="pair">
                                            <img
                                                width="30px"
                                                height="30px"
                                                src={trade.logo}
                                                alt="coin logo"
                                            />
                                            {trade.pair}
                                        </td>
                                        <td align="center" className="date">
                                            {trade.date}
                                        </td>
                                        <td align="center" className={trade.color}>
                                            ${trade.profit_loss.toFixed(2)}
                                        </td>
                                        <td align="center" className={trade.color}>
                                            {trade.percentage.toFixed(2)}%
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

export default TradesOnHold;
