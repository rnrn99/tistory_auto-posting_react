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
  Select,
} from "antd";

const { Title } = Typography;
const { TextArea } = Input;

function MainPage() {
  const [Year, setYear] = useState("");
  const [Month, setMonth] = useState("");
  const [Date, setDate] = useState("");
  const [RedirectUri, setRedirectUri] = useState("");
  const [AccessToken, setAccessToken] = useState("");
  const [CategoryID, setCategoryID] = useState("");
  const [Team, setTeam] = useState("");
  const [PostingTitle, setPostingTitle] = useState("");
  const [Comment, setComment] = useState("");
  const [Tags, setTags] = useState("");
  const [Image, setImage] = useState([]);
  const [ImageButtonVisible, setImageButtonVisible] = useState(false);
  const [ImageButtonClick, setImageButtonClick] = useState(false);
  const [PostingURL, setPostingURL] = useState("");

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
    setYear(value.format("Y"));
    setMonth(value.format("M"));
    setDate(value.format("D"));
  };

  const onPostingTitleHandler = (value) => {
    setPostingTitle(value);
  };

  const onCommentHandler = (e) => {
    setComment(e.currentTarget.value);
  };

  const onTagsHandler = (value) => {
    setTags(`${value}`);
  };

  const scrapeData = () => {
    // 서버 단으로 요청 보내서 scrape.js 동작
    let variable = {
      year: Year,
      month: Month,
      date: Date,
      teamCode: Team,
    };
    message.loading("경기 기록을 가져오고 있습니다. 잠시만 기다려주세요.", 20);

    axios.post("/api/posting/getGameResult", variable).then((response) => {
      if (response.data.success) {
        message.success("경기 기록을 가져오는 데에 성공했습니다.");
        setImageButtonVisible(!ImageButtonVisible);
      } else {
        message.error(
          "경기 기록을 가져오는 데에 실패했습니다. 잠시후 다시 시도해 주세요.",
        );
      }
    });
  };

  const handleImage = () => {
    setImageButtonClick(!ImageButtonClick);

    let variable = {
      month: parseInt(Month) > 9 ? Month : "0" + Month,
      date: parseInt(Date) > 9 ? Date : "0" + Date,
    };

    axios.post("/api/posting/getImage", variable).then((response) => {
      if (response.data.success) {
        setImage(response.data.image);
      } else {
        message.error(
          "사진을 가져오는 데에 실패했습니다. 잠시후 다시 시도해 주세요",
        );
      }
    });
  };

  const renderingImage = () => {
    const image = [];
    for (const i of Image) {
      image.push(
        <img
          src={"https://res.cloudinary.com/dxr1xgmcb/image/upload/posting/" + i}
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
    console.log(Image);

    let variable = {
      accessToken: AccessToken,
      redirectUri: RedirectUri,
      postingTitle: PostingTitle,
      comment: Comment,
      category: CategoryID,
      image: Image,
      tag: Tags,
    };

    axios.post("/api/posting/posting", variable).then((response) => {
      if (response.data.success) {
        message.success("블로그에 포스팅했습니다.");
        setPostingURL(response.data.url);
      } else {
        message.error(
          "블로그에 포스팅하는데 실패했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    });
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

        <Form.Item label="Tags">
          <Select
            mode="tags"
            placeholder="Enter your tags"
            onChange={onTagsHandler}
          ></Select>
        </Form.Item>

        {ImageButtonVisible && (
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
          {PostingURL !== "" && (
            <Button type="link" style={{ float: "right" }}>
              <a href={PostingURL} target="_blank" rel="noopener noreferrer">
                블로그 확인하러 가기
              </a>
            </Button>
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

export default MainPage;
