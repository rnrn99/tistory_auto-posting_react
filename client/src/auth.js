import React, { useEffect } from "react";
import { authUser } from "./_action/userAction";
import { useSelector, useDispatch } from "react-redux";
import { message } from "antd";

export default function authentication(SpecificComponent, option) {
  function AuthenticationCheck(props) {
    let user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
      dispatch(authUser()).then((response) => {
        if (!response.payload.isAuth) {
          if (option) {
            props.history.push("/login");
          }
        } else {
          if (option === false) {
            message.error("잘못된 접근입니다.");
            props.history.push("/");
          }
        }
      });
    }, []);

    return <SpecificComponent {...props} user={user} />;
  }
  return AuthenticationCheck;
}
