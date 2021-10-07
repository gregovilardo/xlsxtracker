import { useEffect, useState } from "react";
import React from "react-dom";
import { getTracker } from "../helpers/getTracker";
import { useCurrentUser } from "./CurrentUserContext";
import NavBar from "./NavBar";
import Footer from "./Footer";



const url = process.env.BACK_END_URL || "http://localhost:8000";


function Trades() {
    const [trades, setTrades] = useState([]);
    const { currentUser } = useCurrentUser();

    useEffect(() => {
        setTrades([])
        const fetchTrades = async () => {
            try {
                const response = await getTracker(
                    "trades",
                    url
                );
                response.json().then(data=>{
                    try{
                        data.forEach((trade) => {
                            trade.start = trade.start.substring(0, 10);
                            trade.end = trade.end.substring(0, 10);
                            trade.profit_loss > 0 ? trade.color = "profit" : trade.color = "loss"
                            // (date.replace("T", " ").replace("Z", "")) for details of the trade
                            setTrades((prevTrade) => [...prevTrade, trade]);
                        });
                    } catch (e) {
                        console.log(e);
                    }
                })
            } catch (e) {
                console.log(e);
            }
        };
        fetchTrades();
        // i disable the props.url warning
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser,]);


    return (
        <div className="trades">
            <div className="page-wrap">
                <NavBar />
                    
                    <div class="section">
                        <div className="title">Trades</div>
                        <div className="table">
                            <table cellSpacing="0">
                                <tr>
                                    <th align="center">
                                        Pair
                                    </th>
                                    <th align="center" className="date">
                                        Start
                                    </th>
                                    <th align="center" className="date">
                                        End
                                    </th>
                                    <th align="right" className="p-l">
                                        Profit/Loss
                                    </th>
                                    <th align="right" className="prctg">
                                        Percentage
                                    </th>
                                </tr>

                                {trades.map((trade) => {
                                    return (
                                        <tr key={trade.id}>
                                            <td align="center" className="pair">
                                                <img width="30px" height="30px" src={trade.logo} alt="coin logo" />
                                                {trade.pair}
                                            </td>
                                            <td align="center" className="date">
                                                {trade.start}
                                            </td>
                                            <td align="center" className="date">
                                                {trade.end}
                                            </td>
                                            <td align="right" className={trade.color}>
                                                ${trade.profit_loss.toFixed(2)}
                                            </td>
                                            <td align="right" className={trade.color}>
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

export default Trades;
