import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, message, Typography } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { registerUser } from "../../_action/userAction";
import { useDispatch } from "react-redux";

const { Title } = Typography;

function RegisterPage(props) {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        name: "",
        userId: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object().shape({
        name: Yup.string().required("닉네임을 입력해 주세요."),
        userId: Yup.string().required("아이디를 입력해 주세요."),
        password: Yup.string()
          .min(4, "비밀번호는 4자 이상만 가능합니다.")
          .required("비밀번호를 입력해 주세요."),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
          .required("필수 항목입니다."),
      })}
      onSubmit={(value, { setSubmitting }) => {
        setTimeout(() => {
          let data = {
            name: value.name,
            userId: value.userId,
            password: value.password,
          };

          dispatch(registerUser(data)).then((response) => {
            console.log(response.payload);
            if (response.payload.success) {
              message.success("회원가입 성공");
              props.history.push("/");
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
            <Title level={3} style={{ marginLeft: "75px" }}>
              SIGN UP
            </Title>
            <Form
              onSubmit={handleSubmit}
              style={{ minWidth: "400px" }}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 24 }}
            >
              <Form.Item required label="Name">
                <Input
                  id="name"
                  placeholder="Enter your nickname"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.name && touched.name
                      ? "text-input error"
                      : "text-input"
                  }
                />
                {errors.name && touched.name && (
                  <div className="input-feedback">{errors.name}</div>
                )}
              </Form.Item>
              <Form.Item required label="ID">
                <Input
                  id="userId"
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
              <Form.Item required label="Password">
                <Input.Password
                  id="password"
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
              <Form.Item required label="Confirm">
                <Input.Password
                  id="confirmPassword"
                  placeholder="Enter your confirm password"
                  type="password"
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={
                    errors.confirmPassword && touched.confirmPassword
                      ? "text-input error"
                      : "text-input"
                  }
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <div className="input-feedback">{errors.confirmPassword}</div>
                )}
              </Form.Item>
              <Form.Item wrapperCol={{ span: 24, offset: 5 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-form-button"
                  style={{ minWidth: "100%" }}
                  disabled={isSubmitting}
                  onClick={handleSubmit}
                >
                  회원가입
                </Button>
              </Form.Item>
            </Form>
          </div>
        );
      }}
    </Formik>
  );
}

export default RegisterPage;
