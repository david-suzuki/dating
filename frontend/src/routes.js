import LoginPage from "views/Pages/LoginPage.js";
import RegisterPage from "views/Pages/RegisterPage.js";
import RecoverPassword from "views/Pages/RecoverPass.js";
import Home from "views/Pages/Home";
var dashRoutes = [
  {
    path: "/login",
    name: "Login Page",
    component: LoginPage,
    layout: "/auth",
  },
  {
    path: "/register",
    name: "Register Page",
    component: RegisterPage,
    layout: "/auth",
  },
  {
    path: "/resetpass",
    name: "Recover Password",
    component: RecoverPassword,
    layout: "/auth",
  },
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   component: Dashboard,
  //   layout: "/admin"
  // },
];
export default dashRoutes;
