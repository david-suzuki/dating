import React, {
  useState,
  useCallback,
  useRef,
  Fragment,
  useEffect,
} from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import Divider from "@material-ui/core/Divider";

import AvatarImage from "../../assets/img/faces/noname.jpg";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  FormHelperText,
  TextField,
  Checkbox,
  Typography,
  FormControlLabel,
  withStyles,
  Switch,
  Grid,
} from "@material-ui/core";
import TopHeader from "views/components/Home/TopHeader.js";
import Footer from "views/components/Home/Footer";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";

import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import AddAlert from "@material-ui/icons/AddAlert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import Avatar from "@material-ui/core/Avatar";
import Button from "components/CustomButtons/Button";
import Snackbar from "components/Snackbar/Snackbar.js";
import ChatContent from "./ChatContent.js";

// import request from "../../../api/request";
import config from "config/config";

import * as userService from "services/userService";
import * as storageService from "services/storageService";

const styles = (theme) => ({
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:enabled:hover": {
      color: theme.palette.primary.dark,
    },
    "&:enabled:focus": {
      color: theme.palette.primary.dark,
    },
  },
  right: {
    float: "right",
  },
  blood: {
    width: "100%",
    marginTop: "15px",
    marginBottom: "10px",
  },
  input: {
    display: "none",
  },
});

function PersonalProfile(props) {
  const user_id = props.match.params.id;

  // getting current loggedin user's id
  let login_user = localStorage.getItem("user");
  let login_user_id = JSON.parse(login_user).id;

  // if user selects his profile
  let isSelfProfile = user_id == login_user_id;

  const { setStatus, theme, onClose, openTermsDialog, status, classes } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [uid, setUId] = useState(0);
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [blood, setBlood] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [language, setLanguage] = useState("");
  const [character, setCharacter] = useState("");
  const [play, setPlay] = useState("");
  const [job, setJob] = useState("");
  const [income, setIncome] = useState("");
  const [education, setEducation] = useState("");
  const [living, setLiving] = useState("");
  const [faith, setFaith] = useState("");
  const [meal, setMeal] = useState("");
  const [interest, setInterest] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fromCnt, setFromCnt] = useState(0);
  const [toCnt, setToCnt] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const [hasTermsOfServiceError, setHasTermsOfServiceError] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [liked, setLiked] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [likedList, setLikedList] = useState();

  const history = useHistory();

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState("br");
  const [notifyColor, setNotifyColor] = useState("danger");
  const [message, setMessage] = useState("");

  const [chat, setChat] = useState(false);
  const [chatting, setChatting] = useState(false);

  const [showFollowers, setShowFollowers] = React.useState(false);

  useEffect(() => {
    userService.getProfile(user_id).then((result) => {
      if (result.data && result.data.profile) {
        // id of user table for chatting
        setUId(result.data.profile.uid);
        setName(result.data.profile.name);
        setBirthday(result.data.profile.birthday);
        setBlood(result.data.profile.blood);
        setBirthPlace(result.data.profile.birthplace);
        setLanguage(result.data.profile.language);
        setCharacter(result.data.profile.character);
        setPlay(result.data.profile.play);
        setJob(result.data.profile.job);
        setIncome(result.data.profile.income);
        setEducation(result.data.profile.education);
        setLiving(result.data.profile.living);
        setFaith(result.data.profile.faith);
        setMeal(result.data.profile.meal);
        setInterest(result.data.profile.interest);
        setIntroduction(result.data.profile.introduction);
        setFromCnt(result.data.profile.from);
        setToCnt(result.data.profile.to);
        setLikedList(result.data.profile.likedlist);
        console.log("likedList  ", result.data.profile.likedlist);
        setLiked(result.data.profile.liked);
        setChatting(result.data.profile.chatting);
        if (result.data.profile.avatar !== "")
          setFile(config.baseUrl + "avatars/" + result.data.profile.avatar);
      }
    });
  }, [user_id]);

  const showNotification = (place, message, notifyColor) => {
    setPlace(place);
    setNotifyColor(notifyColor);
    setMessage(message);
    setShow(true);
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };

  const handleChange = (event) => {
    setBlood(event.target.value);
  };

  const [file, setFile] = useState(AvatarImage);

  const handleImageChange = (event) => {
    setFile(URL.createObjectURL(event.target.files[0]));
    setSelectedFile(event.target.files[0]);
  };

  const handleLike = () => {
    if (!liked) {
      userService.sendLike(user_id).then(({ status, data }) => {
        if (status === 200 && data.message === "success") {
          showNotification("br", "「気になる」を申請しました。", "success");
          setLiked(true);
          setChatting(data.chatting);
        } else {
          showNotification("br", "プロフィールを入力してください。", "danger");
        }
      });
    } else {
      userService.sendUnLike(user_id).then(({ status, data }) => {
        console.log(data);
        if (status === 200 && data.message === "success") {
          showNotification("br", "「気になる」を解除しました。", "success");
          setLiked(false);
          setChatting(data.chatting);
        } else {
          showNotification("br", "プロフィールを入力してください。", "danger");
        }
      });
    }
  };

  const handleSkip = () => {
    let skips = storageService.getStorage("skip");
    skips.push(user_id);

    storageService.setStorage("skip", skips);
    setSkipped(true);
  };

  const handleChat = () => {
    setChat(!chat);
  };

  return (
    <Fragment>
      <TopHeader id="top" />
      <Grid container>
        <Grid item xs={12} sm={6} lg={2} data-aos="zoom-in-up"></Grid>
        <Grid
          item
          xs={12}
          sm={6}
          lg={10}
          data-aos="zoom-in-up"
          style={{ marginTop: "150px" }}
        >
          <Grid container>
            <Grid item xs={12} sm={12} lg={12} data-aos="zoom-in-up">
              <span
                style={{ fontSize: "18px", color: "black", fontWeight: "500" }}
              >
                {chat ? "チャット" : "プロフィール情報"}
              </span>
              <Divider />
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid
              item
              xs={12}
              sm={6}
              lg={3}
              data-aos="zoom-in-up"
              style={{
                padding: "10px",
              }}
            >
              <img
                src={file}
                style={{ width: "100%", height: "100" }}
                alt="avatar"
              />
              {!isSelfProfile && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleLike();
                    }}
                    color="rose"
                    startIcon={<FavoriteIcon />}
                    style={{ marginTop: 30 }}
                  >
                    {liked ? "気になるを解除" : "気になる"}
                  </Button>
                </div>
              )}
              {!isSelfProfile && !liked && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleSkip();
                    }}
                    color="facebook"
                    disabled={skipped}
                    startIcon={<ThumbUpIcon />}
                    style={{ marginTop: 10 }}
                  >
                    スキップ
                  </Button>
                </div>
              )}
              {!isSelfProfile && (
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    variant="outlined"
                    color="twitter"
                    disabled={!chatting}
                    startIcon={<ThumbUpIcon />}
                    style={{ marginTop: 10 }}
                    onClick={() => handleChat()}
                  >
                    {chat ? "プロフィール" : "チャット"}
                  </Button>
                </div>
              )}
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <Typography variant="subtitle1">フォロワー数： {likedList ? likedList.length : 0}人</Typography>
                <FormControlLabel
                  control={
                    <Switch
                    checked={showFollowers}
                    onChange={ () => setShowFollowers(!showFollowers) }
                    />
                  }
                  label={<span style={{ fontSize: '12px' }}>フォロワーを表示する</span>}
                  />
              </div>
              {showFollowers && (
                <div
                  style={{
                    marginTop: 10,
                    border: "1px solid lightgrey",
                    borderRadius: "3px",
                  }}
                >
                  {likedList &&
                    likedList.map((item, key) => {
                      return (
                        <div
                          key={key}
                          style={{ display: "flex", margin: 10 }}
                        >
                          <Avatar
                            alt="Remy Sharp"
                            style={{ height: '22px', width: '22px', marginRight: 10 }}
                            src={
                              item.avatar
                                ? config.baseUrl + "avatars/" + item.avatar
                                : AvatarImage
                            }
                          />                          
                          <Typography key={key} variant="subtitle2">
                            <a
                              href={"/personalProfile/" + item.id}
                              style={{ color: "#3C4858" }}
                            >
                              {item.name}
                            </a>
                          </Typography>
                        </div>
                      );
                    })}
                </div>
              )}
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              lg={9}
              data-aos="zoom-in-up"
              style={{
                padding: "10px",
              }}
            >
              {chat ? (
                <Grid
                  container
                  justifyContent="flex-start"
                  style={{ margin: 10 }}
                >
                  <ChatContent uid={uid} />
                </Grid>
              ) : (
                <Grid container justifyContent="flex-start">
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    lg={6}
                    data-aos="zoom-in-up"
                    style={{
                      padding: "10px",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidName"}
                      label="氏名"
                      autoComplete="off"
                      type="text"
                      value={name}
                      onChange={(event) => {
                        if (status === "invalidName") {
                          setStatus(null);
                        }
                        setName(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      id="date"
                      label="生年月日"
                      margin="normal"
                      type="date"
                      disabled
                      value={birthday}
                      fullWidth
                      variant="outlined"
                      defaultValue="2017-05-24"
                      className={classes.textField}
                      onChange={(event) => {
                        setBirthday(event.target.value);
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <FormControl variant="outlined" className={classes.blood}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        血液型
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={blood}
                        disabled
                        onChange={handleChange}
                        label="Blood"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"O"}>O</MenuItem>
                        <MenuItem value={"A"}>A</MenuItem>
                        <MenuItem value={"B"}>B</MenuItem>
                        <MenuItem value={"C"}>AB</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidEmail"}
                      label="出身地"
                      autoComplete="off"
                      type="text"
                      value={birthPlace}
                      onChange={(event) => {
                        setBirthPlace(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <FormControl variant="outlined" className={classes.blood}>
                      <InputLabel id="demo-simple-select-outlined-label">
                        言語
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={language}
                        disabled
                        onChange={(event) => {
                          setLanguage(event.target.value);
                        }}
                        label="Blood"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={"English"}>English</MenuItem>
                        <MenuItem value={"Japanese"}>Japanese</MenuItem>
                      </Select>
                    </FormControl>
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidEmail"}
                      label="性格"
                      autoComplete="off"
                      type="text"
                      value={character}
                      onChange={(event) => {
                        setCharacter(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidEmail"}
                      label="趣味や余暇の過ごし方"
                      autoComplete="off"
                      type="text"
                      value={play}
                      onChange={(event) => {
                        setPlay(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={5}
                    data-aos="zoom-in-up"
                    data-aos-delay="200"
                    style={{
                      padding: "10px",
                    }}
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidName"}
                      label="職業"
                      autoComplete="off"
                      type="text"
                      value={job}
                      onChange={(event) => {
                        setJob(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      disabled
                      fullWidth
                      error={status === "invalidName"}
                      label="年収"
                      autoComplete="off"
                      type="text"
                      value={income}
                      onChange={(event) => {
                        setIncome(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidName"}
                      label="学歴"
                      autoComplete="off"
                      type="text"
                      value={education}
                      onChange={(event) => {
                        setEducation(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidName"}
                      label="居住地"
                      autoComplete="off"
                      type="text"
                      value={living}
                      onChange={(event) => {
                        setLiving(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      disabled
                      fullWidth
                      error={status === "invalidName"}
                      label="信仰"
                      autoComplete="off"
                      type="text"
                      value={faith}
                      onChange={(event) => {
                        setFaith(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      fullWidth
                      disabled
                      error={status === "invalidName"}
                      label="食事"
                      autoComplete="off"
                      type="text"
                      value={meal}
                      onChange={(event) => {
                        setMeal(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <TextField
                      variant="outlined"
                      margin="normal"
                      fullWidth
                      disabled
                      error={status === "invalidName"}
                      label="興味・関心"
                      autoComplete="off"
                      type="text"
                      value={interest}
                      onChange={(event) => {
                        setInterest(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                  </Grid>
                </Grid>
              )}
              {!chat && (
                <Grid container>
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    lg={11}
                    style={{
                      padding: "10px",
                    }}
                    data-aos="zoom-in-up"
                  >
                    <TextField
                      variant="outlined"
                      margin="normal"
                      required
                      disabled
                      fullWidth
                      error={status === "invalidName"}
                      label="自己紹介"
                      autoComplete="off"
                      type="text"
                      value={introduction}
                      onChange={(event) => {
                        setIntroduction(event.target.value);
                      }}
                      FormHelperTextProps={{ error: true }}
                    />
                    <a
                      href="/"
                      style={{ color: "#e12e3e" }}
                      rel={"noindex nofollow"}
                    >
                      <Button
                        // onClick={() => handleLogOut()}
                        style={{ backgroundColor: "#e12e3e" }}
                      >
                        戻る
                      </Button>
                    </a>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>

          <Snackbar
            place={place}
            // color="danger"
            color={notifyColor}
            icon={AddAlert}
            message={message}
            open={show}
            closeNotification={() => setShow(false)}
            close
          />
        </Grid>
      </Grid>
      <Footer />
    </Fragment>
  );
}

PersonalProfile.propTypes = {
  theme: PropTypes.object,
  onClose: PropTypes.func,
  openTermsDialog: PropTypes.func,
  status: PropTypes.string,
  setStatus: PropTypes.func,
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(PersonalProfile);
