import React, { useState } from "react";
import axios from "axios";
import { Form, Input, Button, message, Typography } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addInfo } from "../../_action/infoAction";

// 기존 data 있으면 불러오게 해야함

const { Title } = Typography;

function UserInfoPage(props) {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);
  const info = useSelector((state) => state.info);

  const [AppID, setAppID] = useState(info.infoData ? info.infoData.addId : "");
  const [SecretKey, setSecretKey] = useState(
    info.infoData ? info.infoData.secretKey : "",
  );
  const [RedirectUri, setRedirectUri] = useState(
    info.infoData ? info.infoData.redirectUri : "",
  );
  const [Code, setCode] = useState(info.infoData ? info.infoData.code : "");
  const [AccessToken, setAccessToken] = useState(
    info.infoData ? info.infoData.accessToken : "",
  );

  const onAppIDHandler = (e) => {
    setAppID(e.currentTarget.value);
  };

  const onSecretKeyHandler = (e) => {
    setSecretKey(e.currentTarget.value);
  };
  const onRedirectUriHandler = (e) => {
    setRedirectUri(e.currentTarget.value);
  };
  const onCodeHandler = (e) => {
    setCode(e.currentTarget.value);
  };

  const handleReceive = () => {
    let variable = {
      appId: AppID,
      secretKey: SecretKey,
      redirectUri: RedirectUri,
      code: Code,
    };
    axios.post("/api/info/getAccessToken", variable).then((response) => {
      if (response.data.success) {
        setAccessToken(response.data.access_token);
      } else {
        message.error(
          "토큰 발급에 실패했습니다. 코드를 다시 받은 후 시도해 주세요.",
        );
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let variable = {
      user: user.userData._id,
      appId: AppID,
      secretKey: SecretKey,
      redirectUri: RedirectUri,
      code: Code,
      accessToken: AccessToken,
    };

    dispatch(addInfo(variable)).then((response) => {
      if (response.payload.success) {
        message.success("추가 정보를 성공적으로 업로드 했습니다.");
        setTimeout(() => {
          props.history.push("/main");
        }, 2000);
      } else {
        message.error("추가 정보를 업로드하는데 실패했습니다.");
      }
    });
  };
  return (
    <div className="app">
      <Title level={2} style={{ marginLeft: "75px" }}>
        추가 정보
      </Title>
      <Form
        onSubmit={handleSubmit}
        style={{ width: "400px" }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item label="AppID">
          {info.infoData ? (
            info.infoData.appId
          ) : (
            <Input
              id="appId"
              placeholder="Enter your AppID"
              type="text"
              value={AppID}
              onChange={onAppIDHandler}
            />
          )}
        </Form.Item>
        <Form.Item label="SecretKey">
          {info.infoData ? (
            info.infoData.secretKey
          ) : (
            <Input
              id="secretKey"
              placeholder="Enter your secretKey"
              type="text"
              value={SecretKey}
              onChange={onSecretKeyHandler}
            />
          )}
        </Form.Item>
        <Form.Item label="redirectUri">
          {info.infoData ? (
            info.infoData.redirectUri
          ) : (
            <Input
              id="redirectUri"
              placeholder="Enter your redirectUri"
              type="text"
              value={RedirectUri}
              onChange={onRedirectUriHandler}
            />
          )}
        </Form.Item>
        <Form.Item label="code">
          {info.infoData ? (
            info.infoData.code
          ) : (
            <Input
              id="code"
              placeholder="Enter your code"
              type="text"
              value={Code}
              onChange={onCodeHandler}
            />
          )}
        </Form.Item>
        <Form.Item label="accessToken">
          {AccessToken}
          <Button type="primary" onClick={handleReceive}>
            발급받기
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24, offset: 5 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ minWidth: "100%" }}
            onClick={handleSubmit}
          >
            등록하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default UserInfoPage;
