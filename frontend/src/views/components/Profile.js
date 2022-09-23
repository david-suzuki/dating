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
import Button from "../../components/CustomButtons/Button";
import Snackbar from "components/Snackbar/Snackbar.js";

import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import IconButton from "@material-ui/core/IconButton";
import PhotoCamera from "@material-ui/icons/PhotoCamera";
import AddAlert from "@material-ui/icons/AddAlert";
import FavoriteIcon from "@material-ui/icons/Favorite";
import Avatar from "@material-ui/core/Avatar";
// import request from "../../../api/request";
import config from "config/config";
import ApproaveModal from "./Home/ApproaveModal";

import * as userService from "services/userService";

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

function Profile(props) {
  const user_id = props.match.params.id;
  const { setStatus, theme, onClose, openTermsDialog, status, classes } = props;
  const [isLoading, setIsLoading] = useState(false);
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
  const registerTermsCheckbox = useRef();
  const registerPassword = useRef();
  const registerPasswordRepeat = useRef();
  const history = useHistory();

  const [show, setShow] = useState(false);
  const [place, setPlace] = useState("br");
  const [notifyColor, setNotifyColor] = React.useState("danger");
  const [message, setMessage] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [favoriteList, setFavoriteList] = useState();
  const [showFavorites, setShowFavorites] = React.useState(false);

  useEffect(() => {
    userService.getProfile(user_id).then((result) => {
      if (result.data.profile !== null) {
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
        setFavoriteList(result.data.profile.favoritelist);
        console.log("favoriteList  ", result.data.profile.favoritelist);

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

  const handleShowModal = (event) => {
    setShowModal((prevShowModal) => !prevShowModal);
  };

  const handleChange = (event) => {
    setBlood(event.target.value);
  };

  const [file, setFile] = useState(AvatarImage);

  const handleImageChange = (event) => {
    setFile(URL.createObjectURL(event.target.files[0]));
    setSelectedFile(event.target.files[0]);
  };

  const onSubmit = () => {
    let profileData = new FormData();
    profileData.append("name", name);
    profileData.append("birthplace", birthPlace);
    profileData.append("birthday", birthday);
    profileData.append("blood", blood);
    profileData.append("language", language);
    profileData.append("character", character);
    profileData.append("play", play);
    profileData.append("job", job);
    profileData.append("income", income);
    profileData.append("education", education);
    profileData.append("living", living);
    profileData.append("faith", faith);
    profileData.append("meal", meal);
    profileData.append("interest", interest);
    profileData.append("introduction", introduction);
    profileData.append("file", selectedFile);

    userService
      .updateProfile(profileData)
      .then(({ status, data }) => {
        if (status === 200) {
          // window.location.reload();
          showNotification("br", "プロフィール編集が完了しました。", "success");
        } else if (status === 422) {
          showNotification("br", "すべての項目を記入してください。", "danger");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const register = useCallback(() => {
    if (!registerTermsCheckbox.current.checked) {
      setHasTermsOfServiceError(true);
      return;
    }
    if (
      registerPassword.current.value !== registerPasswordRepeat.current.value
    ) {
      setStatus("passwordsDontMatch");
      return;
    }
    setStatus(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, [
    setIsLoading,
    setStatus,
    setName,
    setHasTermsOfServiceError,
    registerPassword,
    registerPasswordRepeat,
    registerTermsCheckbox,
  ]);

  return (
    <Fragment>
      <TopHeader id="top" />
      {showModal && (
        <ApproaveModal handleModal={handleShowModal} userid={user_id} />
      )}
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
                　プロフィール情報
              </span>
              <Divider />
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid
              item
              xs={12}
              sm={6}
              lg={2}
              data-aos="zoom-in-up"
              style={{
                padding: "10px",
              }}
            >
              <input
                accept="image/*"
                className={classes.input}
                id="icon-button-file"
                type="file"
                onChange={handleImageChange}
              />
              <img
                src={file}
                style={{ width: "100%", height: "100" }}
                alt="avatar"
              />
              <label htmlFor="icon-button-file" style={{ marginLeft: "37%" }}>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="rose"
                  onClick={handleShowModal}
                  startIcon={<FavoriteIcon />}
                  style={{ marginTop: 10 }}
                >
                  承認する
                </Button>
              </div>
              <div style={{ marginTop: 20, textAlign: "center" }}>
                <Typography variant="subtitle1">フォロー数： {favoriteList ? favoriteList.length : 0}人</Typography>
                <FormControlLabel
                  control={
                    <Switch
                    checked={showFavorites}
                    onChange={ () => setShowFavorites(!showFavorites) }
                    />
                  }
                  label={<span style={{ fontSize: '11px' }}>フォローを表示する</span>}
                  />
              </div>
              {showFavorites && (
                <div
                  style={{
                    marginTop: 10,
                    border: "1px solid lightgrey",
                    borderRadius: "3px",
                  }}
                >
                  {favoriteList &&
                    favoriteList.map((item, key) => {
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
              lg={5}
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
          <Grid container>
            <Grid item xs={12} sm={12} lg={2} data-aos="zoom-in-up"></Grid>
            <Grid
              item
              xs={12}
              sm={12}
              lg={10}
              style={{
                padding: "10px",
              }}
              data-aos="zoom-in-up"
            >
              <TextField
                variant="outlined"
                margin="normal"
                required
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
              <Button onClick={onSubmit} style={{ backgroundColor: "#e12e3e" }}>
                保存する
              </Button>
              <a href="/" style={{ color: "#e12e3e" }} rel={"noindex nofollow"}>
                <Button
                  // onClick={() => handleLogOut()}
                  style={{ backgroundColor: "#e12e3e" }}
                >
                  戻る
                </Button>
              </a>
            </Grid>
          </Grid>
          <Snackbar
            place={place}
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

Profile.propTypes = {
  theme: PropTypes.object,
  onClose: PropTypes.func,
  openTermsDialog: PropTypes.func,
  status: PropTypes.string,
  setStatus: PropTypes.func,
  classes: PropTypes.object,
};

export default withStyles(styles, { withTheme: true })(Profile);
