import React from "react";
import {HashRouter as Router, Route, Switch} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home"
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

/* && => isLoggedIn이 true일 때에만 Navation을 보여준다!*/

const AppRouter = ({isLoggedIn, userObj, refreshUser}) => {

    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj}/>}
            <Switch>
                {isLoggedIn ? (
                    <>
                        <div
                            style={{
                                maxWidth: 890,
                                width: "100%",
                                margin: "0 auto",
                                marginTop: 80,
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <Route exact path="/">
                                <Home userObj={userObj} />
                            </Route>
                            <Route exact path="/profile">
                                <Profile userObj={userObj} refreshUser={refreshUser} />
                            </Route>
                        </div> 
                    </>
                ) : (
                    <>
                        <Route exact path="/"><Auth /></Route>
                    </>
                )}
            </Switch>
            <Router>

            </Router>
        </Router>
    );

}


export default AppRouter;