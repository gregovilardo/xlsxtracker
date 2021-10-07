from openpyxl import load_workbook
from openpyxl.workbook import workbook


def track_coins(filename):
    wb = load_workbook(filename=filename, data_only=True)
    sheet = wb.active

    trades = {}
    counter = -1

    reversed_excel = list(sheet.iter_rows(min_row=2,
                                    # max_row=30,
                                    max_col=9,
                                    values_only=True))
    for value in reversed_excel:
        if value[8] == "Filled":
            counter += 1

    for value in reversed_excel:
        if value[8] == "Filled":
            trade = {
                "date": value[0],
                "pair": value[1],
                "type": value[2],
                "order_ammount": float(value[4]),
                "price": float(value[5]),
                "filled": float(value[6]),
                "total": float(value[7]),
                "status": value[8],
                "trade_fullfill": False,
                "fees": [],
            }

            trades[counter] = trade
            counter -= 1
        
        if value[0] == None and value[2] != "Trading Price":
            fees = {
                "date": value[1],
                "price": value[2],
                "amount_filled": value[3],
                "total": value[4],
                "fee": value[5],
            } 
            trade["fees"].append(fees)
        

    # if the fee is on the sell, you get the fee in USDT so i substract it for the total that is on USDT, but if you get it on
    # the buy the value is in the coin type so i substract it to the filled, that already has his value on the coin type
    for i in range(len(trades)):
        for fee in trades[i]["fees"]:
            if fee["fee"][10:] == "USDT":
                trades[i]["total"] -= float(fee["fee"][:10])
            else:
                trades[i]["filled"] -= float(fee["fee"][:10])
        del(trades[i]["fees"])
        

    profits = []
    holdings = []
    posible_holdings = []
    # count = 0
    sell_trades = []

    for i in range(len(trades)):
        only_once = True
        # if the type of the trade is SELL it has not poin to compare it
        if trades[i]["type"] == "SELL":
            continue
        is_filled = trades[i]["filled"]
        total = -trades[i]["total"]
        avg_for_rest = round(1 / trades[i]["price"], 15)
        for j in range(i + 1, len(trades)):
            if trades[i]["pair"] == trades[j]["pair"]:
                only_once = False
                if trades[j]["type"] == "BUY":
                    is_filled = round(is_filled + trades[j]["filled"], 15)
                    total = total - trades[j]["total"]
                else:
                    is_filled = round(is_filled - trades[j]["filled"], 15)
                    total = total + trades[j]["total"]
                    sell_trades.append([trades[j], trades[i]])
                if is_filled < avg_for_rest and is_filled  > -avg_for_rest:
                    trades[i]["trade_fullfill"] = True
                    profit = {
                        "start": trades[i]["date"],
                        "end": trades[j]["date"],
                        "pair": trades[i]["pair"],
                        "percentage": round((total / trades[i]["total"]) * 100, 2) ,
                        "profit_loss": round(total, 2)
                    }
                    profits.append(profit)
                    # count += 1
                if trades[i]["trade_fullfill"] == True:
                    n = trades[i]["pair"]
                    break
                else:
                    hold = {
                        "inicial_trade": trades[i],
                        "pair": trades[i]["pair"],
                        "start": trades[i]["date"],
                        "filled": trades[i]["filled"],
                        "start": trades[i]["date"],
                        "total_on_fill": trades[i]["total"],
                        "price_on_fill": trades[i]["price"],
                        "holding": is_filled,
                    }
                    posible_holdings.append(hold)
        if only_once == True:
            hold = {
                "inicial_trade": trades[i],
                "pair": trades[i]["pair"],
                "start": trades[i]["date"],
                "filled": trades[i]["filled"],
                "start": trades[i]["date"],
                "total_on_fill": trades[i]["total"],
                "price_on_fill": trades[i]["price"],
                "holding": is_filled,
            }
            holdings.append(hold)


    # trades not closed, means that this are your holdings
    for hold in posible_holdings:
        if hold["inicial_trade"]["trade_fullfill"] == False:
            holdings.append(hold)


    actually_holding = []
    for i in range(len(holdings)-1):
        # try:
        if holdings[i]["inicial_trade"]["pair"] != holdings[i+1]["inicial_trade"]["pair"]:
            actually_holding.append(holdings[i])
        # except IndexError:
        #     pass



    # sells that occurs in trades that are not closed yet
    sell_hold_trades = []
    for trade in sell_trades:
        if trade[1]["trade_fullfill"] == False:
            sell_hold_trades.append(trade)

    profit_trades_on_holds = []
    c = 0
    for trade in sell_hold_trades[:]:
        if  trade[0]["order_ammount"] > trade[1]["order_ammount"]:
            sell_hold_trades.remove(trade)

    for trade in sell_hold_trades:
        sell_trade = { 
            "pair": trade[0]["pair"],
            "percentage": -(((trade[0]["price"] - trade[1]["price"]) / trade[1]["price"]) * 100),
            "filled": trade[1]["filled"],
            "date": trade[1]["date"],
            "profit_loss": -((trade[0]["filled"] * trade[1]["price"]) - trade[0]["total"])
        }
        profit_trades_on_holds.append(sell_trade)
        c += 1


    return {"trades": profits, "holds": actually_holding, "trades_on_hold": profit_trades_on_holds}

    print(json.dumps(profits, sort_keys=True, indent=4))
    print(json.dumps(actually_holding, sort_keys=True, indent=4))
    print(json.dumps(profit_trades_on_holds, sort_keys=True, indent=4))

