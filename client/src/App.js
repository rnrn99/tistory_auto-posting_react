import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Auth from "./auth";
import LoginPage from "./component/LoginPage/LoginPage";
import RegisterPage from "./component/RegisterPage/RegisterPage";
import UserInfoPage from "./component/UserInfoPage/UserInfoPage";
import Navbar from "./component/Navbar/Navbar";
import MainPage from "./component/MainPage/MainPage";

function App() {
  return (
    <Router>
      <div className="navbar">
        <Navbar />
      </div>
      <div>
        <Switch>
          <Route exact path="/" component={Auth(LoginPage, false)} />
          <Route exact path="/main" component={Auth(MainPage, true)} />
          <Route exact path="/register" component={Auth(RegisterPage, false)} />
          <Route exact path="/addinfo" component={Auth(UserInfoPage, true)} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;

// null 누구나 출입 가능
// true 로그인한 사람만 출입 가능
// false 로그인한 사람은 출입 불가능
