import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { CurrentUserProvider } from "./CurrentUserContext"
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Home from "./Home"
import Trades from "./Trades";
import Holds from "./Holds";
import TradesOnHold from "./TradesOnHold";
import Landing from "./Landing";


function App() {
    return (
        <BrowserRouter>
            <Switch>
                <CurrentUserProvider>
                    <div className="app">
                        {/* <Route component={Home} path="/" exact/> */}
                        <PublicRoute restricted={true} component={Landing} path="/auth" exact /> 
                        <PrivateRoute component={Home} path="/" exact />
                        <PrivateRoute component={Trades} path="/trades" exact />
                        <PrivateRoute component={Holds} path="/holds" exact />
                        <PrivateRoute component={TradesOnHold} path="/trades_on_hold" exact />
                    </div>
                </CurrentUserProvider>
            </Switch>
        </BrowserRouter>
    );
}

export default App;


