import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  message,
  Typography,
  AutoComplete,
  DatePicker,
} from "antd";
import { useSelector } from "react-redux";

// <img src="http://localhost:5000/result_0921_0.png" alt="img" />
// parameters = {
//   'access_token': access_token,
//   'output': 'json',
//   'blogName': blogName,
//   'title': title,
//   'content': content,
//   'visibility': '3',
//   'category': categoryId,
//   'tag': '{}, 한화이글스'.format(tag)
// }

const { Title } = Typography;
const { TextArea } = Input;

function MainPage() {
  const [Month, setMonth] = useState("");
  const [Date, setDate] = useState("");
  const [RedirectUri, setRedirectUri] = useState("");
  const [AccessToken, setAccessToken] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [Team, setTeam] = useState("");
  const [PostingTitle, setPostingTitle] = useState("");
  const [Comment, setComment] = useState("");
  const [Image, setImage] = useState([]);
  const [ImageButtonClick, setImageButtonClick] = useState(false);

  useEffect(() => {
    let variable = {
      uniqueId: localStorage.getItem("Id"),
    };

    axios.post("/api/info/getInfo", variable).then((response) => {
      if (response.data.success) {
        if (response.data.info.length > 0) {
          let num = response.data.info.length;
          setRedirectUri(response.data.info[num - 1].redirectUri);
          setAccessToken(response.data.info[num - 1].accessToken);
          setCategoryID(response.data.info[num - 1].categoryId);
          setTeam(response.data.info[num - 1].team);
        }
      } else {
        console.log("정보 없음");
        return;
      }
    });
  }, []);

  const onDateHandler = (value) => {
    setMonth(value.format("M"));
    setDate(value.format("D"));
  };

  const onPostingTitleHandler = (value) => {
    setPostingTitle(value);
  };

  const onCommentHandler = (e) => {
    setComment(e.currentTarget.value);
  };

  const scrapeData = () => {
    // 서버 단으로 요청 보내서 scrape.js 동작
    let variable = {
      month: Month,
      date: Date,
      teamCode: Team,
    };

    message.loading("경기 기록을 가져오고 있습니다. 잠시만 기다려주세요.");

    axios.post("/api/posting/getGameResult", variable).then((response) => {
      if (response.data.success) {
        message.success("경기 기록을 가져오는 데에 성공했습니다.");
        setImage(response.data.image);
      } else {
        message.error(
          "경기 기록을 가져오는 데에 실패했습니다. 잠시후 다시 시도해 주세요.",
        );
      }
    });
  };

  const handleImage = () => {
    setImageButtonClick(!ImageButtonClick);
  };

  const renderingImage = () => {
    const image = [];
    for (const i of Image) {
      image.push(
        <img
          src={"http://localhost:5000/" + i}
          alt={i}
          key={i}
          width="50%"
          height="30%"
        ></img>,
      );
    }
    return image;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(PostingTitle, Comment);
  };

  const options = [
    { value: `${Month}월 ${Date}일` },
    { value: `${Month}월 ${Date}일 야구 기록` },
    { value: `${Month}월 ${Date}일 야구 일기` },
  ];

  return (
    <div className="app">
      <Title level={2} style={{ marginLeft: "75px" }}>
        Posting
      </Title>

      <Form
        onSubmit
        style={{ width: "800px" }}
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 24 }}
      >
        <Form.Item label="Date">
          <DatePicker onChange={onDateHandler} style={{ width: "75%" }} />
          <Button
            type="primary"
            ghost
            style={{ width: "25%" }}
            onClick={scrapeData}
          >
            경기 기록 가져오기
          </Button>
        </Form.Item>

        <Form.Item label="Title">
          <AutoComplete
            placeholder="Enter the title"
            options={options}
            value={PostingTitle}
            onChange={onPostingTitleHandler}
          />
        </Form.Item>

        <Form.Item label="Comment">
          <TextArea
            placeholder="Enter your comment about the game"
            rows={4}
            value={Comment}
            onChange={onCommentHandler}
          ></TextArea>
        </Form.Item>

        {Image.length > 0 && (
          <Form.Item wrapperCol={{ span: 24, offset: 5 }}>
            <Button
              type="primary"
              ghost
              style={{ width: "30%" }}
              onClick={handleImage}
            >
              사진 미리보기
            </Button>
          </Form.Item>
        )}
        {ImageButtonClick && (
          <Form.Item wrapperCol={{ span: 24, offset: 5 }}>
            {renderingImage()}
          </Form.Item>
        )}
        <Form.Item wrapperCol={{ span: 24, offset: 12 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ minWidth: "30%" }}
            onClick={handleSubmit}
          >
            포스팅하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default MainPage;
