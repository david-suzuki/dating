import { httpService } from "./httpService";

export const getUsers = () => {
  return httpService.get("api/admin/users/");
};

export const getBusinesspeople = () => {
  return httpService.get("api/admin/businesses");
};

export const getUserById = ({ id }) => {
  return httpService.get(`users/:${id}`);
};

export const updateUserStatus = (id, status) => {
  return httpService.post("api/admin/user/status", { id, status });
};

export const deleteUser = (id) => {
  return httpService.deleteDetail("api/admin/user/delete/" + id);
};

export const updateUser = ({ id, company, name, phone, email }) => {
  return httpService.put("api/profile/update", {
    id,
    company,
    name,
    phone,
    email,
  });
};

export const getAllProfiles = () => {
  return httpService.get(`api/profiles`);
};

export const getProfile = (id) => {
  return httpService.get(`api/profile/${id}`);
};

export const getUsersApproave = (id) => {
  return httpService.get(`api/profile/approave/${id}`);
};

export const setUsersApproave = (approaveData) => {
  return httpService.post(`api/profile/set_approave`, approaveData);
};

export const updateProfile = (profileData) => {
  return httpService.upload("api/profile/update", profileData);
};

export const getSearchProfiles = (val) => {
  return httpService.post(`api/profiles/search`, val);
};

export const updateUserCompany = ({ id, company, name, phone, email }) => {
  return httpService.put("api/profile/company", {
    id,
    company,
    name,
    phone,
    email,
  });
};

export const updateUserMail = ({ id, company, name, phone, email }) => {
  return httpService.put("api/profile/mail", {
    id,
    company,
    name,
    phone,
    email,
  });
};

export const updateUserPasswd = ({ id, passwd }) => {
  return httpService.put("api/profile/passwd", { id, passwd });
};

export const createUser = ({ company, name, phone, email, password, role }) => {
  //   console.log(login, password);
  return httpService.post("api/admin/user/create", {
    name,
    company,
    phone,
    email,
    password,
    role,
  });
};

export const sendLike = (id) => {
  return httpService.get(`api/profile/like/${id}`);
};

export const sendUnLike = (id) => {
  return httpService.get(`api/profile/unlike/${id}`);
};

export const getChatList = (id) => {
  return httpService.get(`api/chat/list/${id}`);
};

export const searchChatUser = (name) => {
  return httpService.post(`api/chat/search`, name);
};

export const getNumUnreadMsg = (id) => {
   return httpService.get(`api/chat/unread_num/${id}`); 
}
