import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  Popover,
  Select,
} from "antd";
import { useSelector } from "react-redux";
import { QuestionCircleOutlined } from "@ant-design/icons";

// 기존 data 있으면 불러오게 해야함

const { Title } = Typography;
const { Option } = Select;

function UserInfoPage(props) {
  const user = useSelector((state) => state.user);

  const [AppID, setAppID] = useState("");
  const [SecretKey, setSecretKey] = useState("");
  const [RedirectUri, setRedirectUri] = useState("");
  const [Code, setCode] = useState("");
  const [AccessToken, setAccessToken] = useState("");
  const [Category, setCategory] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [Team, setTeam] = useState("");

  useEffect(() => {
    let variable = {
      uniqueId: localStorage.getItem("Id"),
    };

    axios.post("/api/info/getInfo", variable).then((response) => {
      if (response.data.success) {
        if (response.data.info.length > 0) {
          let num = response.data.info.length;
          setAppID(response.data.info[num - 1].appId);
          setSecretKey(response.data.info[num - 1].secretKey);
          setRedirectUri(response.data.info[num - 1].redirectUri);
          setCode(response.data.info[num - 1].code);
          setAccessToken(response.data.info[num - 1].accessToken);
          setCategory(response.data.info[num - 1].category);
          setCategoryID(response.data.info[num - 1].categoryId);
          setTeam(response.data.info[num - 1].team);
        }
      } else {
        console.log("정보 없음");
        return;
      }
    });
  }, []);

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
  const onCategoryHandler = (e) => {
    setCategory(e.currentTarget.value);
  };
  const onTeamHandler = (e) => {
    setTeam(e);
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

  const handleCategory = () => {
    let variable = {
      accessToken: AccessToken,
      redirectUri: RedirectUri,
      category: Category,
    };

    axios.post("/api/info/getCategoryId", variable).then((response) => {
      if (response.data.success) {
        setCategoryID(response.data.categoryId);
      } else {
        message.error("카테고리 id 발급에 실패했습니다.");
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
      category: Category,
      categoryId: CategoryID,
      team: Team,
    };

    console.log(variable);

    axios.post("/api/info/addinfo", variable).then((response) => {
      if (response.data.success) {
        message.success("추가 정보를 성공적으로 업로드 했습니다.");
        setTimeout(() => {
          props.history.push("/main");
        }, 2000);
      } else {
        message.error("추가 정보를 업로드하는데 실패했습니다.");
      }
    });
  };

  const content = (
    <img src="image/how_to_get_AppID.png" alt="how_to_get_AppID" />
  );

  const codeURL = `https://www.tistory.com/oauth/authorize?client_id=${AppID}&redirect_uri=${RedirectUri}&response_type=code`;
  const codePopoverContent = (
    <>
      <img src="image/how_to_get_code.png" alt="how_to_get_code" />
      <a href={codeURL} target="_blank" rel="noopener noreferrer">
        코드 받아오기
      </a>
    </>
  );
  const codePopover = (
    <Popover title="Code 발급받는 법" content={codePopoverContent}>
      <QuestionCircleOutlined />
    </Popover>
  );

  return (
    <div className="app">
      <Title level={2} style={{ marginLeft: "75px" }}>
        추가 정보
      </Title>

      <Popover title="tistory Open API 등록하기" content={content}>
        <div style={{ marginLeft: "620px" }}>
          <a
            href="https://www.tistory.com/guide/api/manage/register"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tistory Open API 등록하기
          </a>
          <QuestionCircleOutlined />
        </div>
      </Popover>

      <Form
        onSubmit={handleSubmit}
        style={{ width: "800px" }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item label="AppID">
          {AppID ? (
            <Input
              id="appId"
              type="text"
              value={AppID}
              onChange={onAppIDHandler}
              allowClear
            />
          ) : (
            <Input
              id="appId"
              placeholder="Enter your AppID"
              type="text"
              value={AppID}
              onChange={onAppIDHandler}
              allowClear
            />
          )}
        </Form.Item>

        <Form.Item label="SecretKey">
          {SecretKey ? (
            <Input
              id="secretKey"
              type="text"
              value={SecretKey}
              onChange={onSecretKeyHandler}
              allowClear
            />
          ) : (
            <Input
              id="secretKey"
              placeholder="Enter your secretKey"
              type="text"
              value={SecretKey}
              onChange={onSecretKeyHandler}
              allowClear
            />
          )}
        </Form.Item>

        <Form.Item label="redirectUri">
          {RedirectUri ? (
            <Input
              id="redirectUri"
              type="text"
              value={RedirectUri}
              onChange={onRedirectUriHandler}
              allowClear
            />
          ) : (
            <Input
              id="redirectUri"
              placeholder="Enter your Blog URL"
              type="text"
              value={RedirectUri}
              onChange={onRedirectUriHandler}
              allowClear
            />
          )}
        </Form.Item>

        <Form.Item label="code">
          {Code ? (
            <Input
              id="code"
              type="text"
              value={Code}
              onChange={onCodeHandler}
              suffix={codePopover}
              allowClear
            />
          ) : (
            <Input
              id="code"
              placeholder="Enter your code"
              type="text"
              value={Code}
              onChange={onCodeHandler}
              suffix={codePopover}
              allowClear
            />
          )}
        </Form.Item>

        <Form.Item label="accessToken">
          {AccessToken}
          <Button
            type="primary"
            ghost
            onClick={handleReceive}
            style={{ float: "right" }}
          >
            발급받기
          </Button>
        </Form.Item>

        <Form.Item label="category">
          <Input.Group compact>
            {Category ? (
              <Input
                value={Category}
                onChange={onCategoryHandler}
                style={{ width: "40%" }}
              />
            ) : (
              <Input
                placeholder="Enter your Blog Category Name"
                onChange={onCategoryHandler}
                style={{ width: "40%" }}
              />
            )}
            <Button
              type="primary"
              ghost
              style={{ width: "20%" }}
              onClick={handleCategory}
            >
              카테고리 등록
            </Button>
            <Input style={{ width: "40%" }} type="text" value={CategoryID} />
          </Input.Group>
        </Form.Item>

        <Form.Item label="좋아하는 팀">
          <Select
            id="team"
            value={Team}
            onChange={onTeamHandler}
            placeholder={Team}
          >
            <Option value="NC">NC</Option>
            <Option value="OB">두산</Option>
            <Option value="KT">KT</Option>
            <Option value="LG">LG</Option>
            <Option value="WO">키움</Option>
            <Option value="HT">KIA</Option>
            <Option value="LT">롯데</Option>
            <Option value="SS">삼성</Option>
            <Option value="SK">SSG</Option>
            <Option value="HH">한화</Option>
          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24, offset: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ minWidth: "30%" }}
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
