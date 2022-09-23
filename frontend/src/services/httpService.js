import axios from "axios";
import config from "../config/config";
import * as storageService from "./storageService";
export const httpService = {
  get,
  post,
  put,
  deleteDetail,
  download,
  upload,
};

function get(apiEndpoint, token) {
  token = storageService.getStorage("token");

  return axios
    .get(config.baseUrl + apiEndpoint, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      // console.log('------axios get resp:', response);

      return response;
    })
    .catch((err) => {
      // console.log('------axios get error:', err);
      var resp = err.response;
      if (
        resp &&
        resp.status == 401 &&
        resp.data.message == "Unauthenticated."
      ) {
        storageService.removeStorage("user");
        storageService.removeStorage("token");
        window.location = "/auth/login";
        err.response.data.message = "fail";
      }
      return err.response;
    });
}

function post(apiEndpoint, payload, token) {
  console.log(payload);
  token = storageService.getStorage('token');
    return axios.post(config.baseUrl+apiEndpoint, payload, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': `Bearer ${token}`
      }
    }).then((response)=>{
        return response;
    }).catch((err)=>{
      console.log('------axios err:', err.response);
      var resp = err.response;
      if (
        resp &&
        resp.status == 401 &&
        resp.data.message == "Unauthenticated."
      ) {
        storageService.removeStorage("user");
        storageService.removeStorage("token");
        window.location = "/auth/login";
        err.response.data.message = "fail";
      }
      return err.response;
    });
}

function put(apiEndpoint, payload, token) {
  token = storageService.getStorage("token");
  console.log("-----axios req put:", payload);

  return axios
    .put(config.baseUrl + apiEndpoint, payload, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
      var resp = err.response;
      if (
        resp &&
        resp.status == 401 &&
        resp.data.message == "Unauthenticated."
      ) {
        storageService.removeStorage("user");
        storageService.removeStorage("token");
        window.location = "/auth/login";
        err.response.data.message = "fail";
      }
      return err.response;
    });
}

function deleteDetail(apiEndpoint, token) {
  token = storageService.getStorage("token");
  return axios
    .delete(config.baseUrl + apiEndpoint, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log(err);
      return err.response;
    });
}

function download(apiEndpoint, token) {
  token = storageService.getStorage("token");

  return axios
    .get(config.baseUrl + apiEndpoint, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // important
    })
    .then((response) => {
      return response;
    })
    .catch((err) => {
      console.log("------axios get resp:", err);
      var resp = err.response;
      if (
        resp &&
        resp.status == 401 &&
        resp.data.message == "Unauthenticated."
      ) {
        storageService.removeStorage("user");
        storageService.removeStorage("token");
        window.location = "/auth/login";
        err.response.data.message = "fail";
      }
      return err.response;
    });
}

function upload(apiEndpoint, payload, token) {
  console.log(payload);
  token = storageService.getStorage("token");
  // console.log('-----axios req:', config.baseUrl+apiEndpoint);
  return axios
    .post(config.baseUrl + apiEndpoint, payload, {
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log("------axios post resp:", response);
      return response;
    })
    .catch((err) => {
      console.log("------axios err:", err.response);
      var resp = err.response;
      if (
        resp &&
        resp.status == 401 &&
        resp.data.message == "Unauthenticated."
      ) {
        storageService.removeStorage("user");
        storageService.removeStorage("token");
        window.location = "/auth/login";
        err.response.data.message = "fail";
      }
      return err.response;
    });
}
