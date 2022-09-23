import React, { Component } from "react";
import { unmountComponentAtNode } from 'react-dom';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import linkedin from 'react-linkedin-login-oauth2/assets/linkedin.png'
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import config from 'config/config';
import axios from 'axios';
import AddAlert from "@material-ui/icons/AddAlert";
import Snackbar from "components/Snackbar/Snackbar.js";
import "./style/social.css";

class SocialAuth extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            place: "",
            message: "",
            show: false 
        };
    }

    onFailure = (error) => {
        this.showNotification("br", "ソーシャル認証に失敗しました。", "danger")
    };

    showNotification = (place, message) => {
        this.setState({
            place: place,
            message: message,
            show: true
        })
        setTimeout(() => {
            this.setState({
                show:false
            })
        }, 6000);
    };

    linkedinResponse = (response) => {
        const code = response.code;

        if (this.props.step == "register") {
            axios.post(config.baseUrl+"api/signup/linkedin", {"code": code}).then((response) => {
                if (response.status == 200 && response.data.isAuth == true) {
                    this.props.socialAuthed(true);
                } else {
                    this.props.socialAuthed(false);
                }
            }).catch((err) => {
                console.log(err);
                this.showNotification("br", "サーバーからの応答がありません.", "danger")
            });    
        } else if (this.props.step == "login") {
            axios.post(config.baseUrl+"api/signin/linkedin", {"code": code}).then((response) => {
                this.props.socialAuthed(response.data);
            }).catch((err) => {
                console.log(err);
                this.showNotification("br", "サーバーからの応答がありません。", "danger")
            });
        }
    };

    facebookResponse = (response) => {
        let accessToken = response.accessToken;
        if (this.props.step == "register") {
            axios.post(config.baseUrl+"api/signup/facebook", {"accessToken": accessToken}).then((response) => {
                if (response.status == 200 && response.data.isAuth == true) {
                    this.props.socialAuthed(true);
                } else {
                    this.props.socialAuthed(false);
                }
            }).catch((err) => {
                console.log(err);
                this.showNotification("br", "サーバーからの応答がありません。", "danger")
            });    
        } else if (this.props.step == "login") {
            axios.post(config.baseUrl+"api/signin/facebook", {"accessToken": accessToken}).then((response) => {
                this.props.socialAuthed(response.data);
            }).catch((err) => {
                console.log(err);
                this.showNotification("br", "サーバーからの応答がありません。", "danger")
            });
        }
    };

    googleResponse = (response) => {
        let accessToken = response.accessToken;

        if (this.props.step == "register") {
            axios.post(config.baseUrl+"api/signup/google", {"accessToken": accessToken}).then((response) => {
                if (response.status == 200 && response.data.isAuth == true) {
                    this.props.socialAuthed(true);
                } else {
                    this.props.socialAuthed(false);
                }
            }).catch((err) => {
                console.log(err);
                this.showNotification("br", "サーバーからの応答がありません。", "danger")
            });    
        } else if (this.props.step == "login") {
            axios.post(config.baseUrl+"api/signin/google", {"accessToken": accessToken}).then((response) => {
                this.props.socialAuthed(response.data);
            }).catch((err) => {
                console.log(err);
                this.showNotification("br", "サーバーからの応答がありません。", "danger")
            });
        }
    }

    componentDidMount() {
        // unmountComponentAtNode(document.getElementById('root'));
        // let linkedinImg = document.getElementsByTagName("img")[1];
        // let linkedinBtn = document.getElementsByClassName("linkedinBtn")[0];
        // unmountComponentAtNode(linkedinImg);
        // linkedinBtn.removeChild(linkedinImg);
        let googleBtn = document.getElementsByClassName("btnGoogle")[0];
        let childDiv = googleBtn.firstChild;
        childDiv.style.marginRight = "0px"

        let linkedinBtn = document.getElementsByClassName("linkedinBtn")[0];
        let childSpan = linkedinBtn.firstChild;
        childSpan.style.marginRight = "8px"
    }

    render() {

        return (
            <div className="App">
                <GoogleLogin
                    className="btnGoogle"
                    clientId={config.GOOGLE_CLIENT_ID}
                    onSuccess={this.googleResponse}
                    onFailure={this.onFailure}
                >
                    <span>&nbsp;Googleでログイン</span>
                </GoogleLogin>
                <br />
                <FacebookLogin
                    appId={config.FACEBOOK_APP_ID}
                    autoLoad={false}
                    fields="name,email,picture"
                    callback={this.facebookResponse}
                    cssClass="btnFacebook"
                    icon={<span style={{fontSize: 20, color: 'Dodgerblue'}}><i className="fab fa-facebook" style={{marginLeft:'2px'}}></i></span>}
                    textButton = "&nbsp;&nbsp;Facebookでログイン"
                    />
                <br />
                <LinkedIn
                    clientId="81lx5we2omq9xh"
                    redirectUri="http://localhost:3000"
                    scope="r_emailaddress"
                    onFailure={this.onFailure}
                    onSuccess={this.linkedinResponse}
                    style={{ width: 190 }}
                    className="linkedinBtn"
                    >
                    <span style={{fontSize: 19, color: 'Dodgerblue'}}><i className="fab fa-linkedin-in"></i></span>
                    <span style={{fontWeight: 'Bold'}}>LinkedInでログイン</span>
                </LinkedIn>
                <Snackbar
                    place={this.state.place}
                    color="danger"
                    icon={AddAlert}
                    message={this.state.message}
                    open={this.state.show}
                    closeNotification={() => this.setState({show: false})}
                    close
                />
            </div>
        );
    }
}

export default SocialAuth;
