import React from "react";
import axios from "axios";
import { SERVER_USER } from "../../config";
import { withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { message } from "antd";

function Navbar(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${SERVER_USER}/logout`).then((response) => {
      if (response.status === 200) {
        window.localStorage.removeItem("Id");
        props.history.push("/");
      } else {
        message.error("로그아웃에 실패했습니다.");
      }
    });
  };

  if (user.userData && !user.userData.isAuth) {
    return (
      <>
        <a href="/">로그인</a>
        <a href="/register">회원가입</a>
      </>
    );
  } else {
    return (
      <>
        <a href="/addinfo">정보 입력하기</a>
        <a onClick={logoutHandler}>로그아웃</a>
      </>
    );
  }
}

export default withRouter(Navbar);
