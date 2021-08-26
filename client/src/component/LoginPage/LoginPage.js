import React from "react";
import { useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, Typography, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { loginUser } from "../../_action/userAction";

const { Title } = Typography;

function LoginPage(props) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        userId: "",
        password: "",
      }}
      validationSchema={Yup.object().shape({
        userId: Yup.string().required("아이디를 입력해 주세요."),
        password: Yup.string()
          .min(4, "비밀번호는 4자 이상만 가능합니다.")
          .required("비밀번호를 입력해 주세요"),
      })}
      onSubmit={(value, { setSubmitting }) => {
        setTimeout(() => {
          let data = {
            userId: value.userId,
            password: value.password,
          };

          dispatch(loginUser(data)).then((response) => {
            if (response.payload.success) {
              console.log(response.payload);
              window.localStorage.setItem("Id", response.payload.uniqueId);
              message.success("로그인 성공");
              props.history.push("/main");
            } else {
              message.error(response.payload.message);
            }
          });
          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
        const {
          values,
          errors,
          touched,
          isSubmitting,
          handleSubmit,
          handleChange,
          handleBlur,
        } = props;

        return (
          <div className="app">
            <Title level={2}>LOGIN</Title>
            <form onSubmit={handleSubmit} style={{ width: "350px" }}>
              <Form.Item required>
                <Input
                  id="userId"
                  size="large"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Enter your ID"
                  type="id"
                  value={values.userId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.userId && touched.userId
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.userId && touched.userId && (
                  <div className="input-feedback">{errors.userId}</div>
                )}
              </Form.Item>
              <Form.Item required>
                <Input.Password
                  id="password"
                  size="large"
                  prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  placeholder="Enter your password"
                  type="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.password && touched.password
                      ? "text-input error"
                      : "text-input"
                  }
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>
              <div>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                  style={{ minWidth: "100%" }}
                  disabled={isSubmitting}
                  onSubmit={handleSubmit}
                >
                  로그인
                </Button>
              </div>
            </form>
          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);
