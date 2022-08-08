import { Box } from "@material-ui/core";
import React from "react";
import { Route, Switch } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Layout from "../component/Layout";

import AdminLogin from "../pages/admin/Login";
import Subjects from "../pages/subject";
import Topics from "../pages/topic";
import SubTopics from "../pages/subTopic";
import Dashboard from "../pages/Dashboard";
import Questions from "../pages/question";
import ViewQuestion from "../pages/question/ViewQuestion";
import AddMCQ from "../pages/question/AddMCQ";
import User from "../pages/user";
import UserDetails from "../pages/user/UserDetails";

const routes = [
  {
    path: "/login",
    component: AdminLogin,
    guard: false,
    layout: true,
    showPagination: false,
  },
  {
    path: "/subject",
    component: Subjects,
    guard: false,
    layout: true,
    showPagination: true,
  },
  // {
  //   path: "/topic",
  //   component: Topics,
  //   guard: true,
  //   layout: true,
  //   showPagination: true,
  // },
  // {
  //   path: "/subTopic",
  //   component: SubTopics,
  //   guard: true,
  //   layout: true,
  //   showPagination: true,
  // },
  {
    path: "/",
    component: Dashboard,
    guard: true,
    layout: true,
    showPagination: false,
  },
  {
    path: "/question",
    component: Questions,
    guard: true,
    layout: true,
    showPagination: true,
  },
  {
    path: "/question/:id",
    component: ViewQuestion,
    guard: true,
    layout: true,
    showPagination: true,
  },
  {
    path: "/add-mcq",
    component: AddMCQ,
    guard: true,
    layout: true,
    showPagination: true,
  },
  {
    path: "/users",
    component: User,
    guard: true,
    layout: true,
  },
  {
    path: "/users/:userId",
    component: UserDetails,
    guard: true,
    layout: true,
  },
];

class Routes extends React.Component {
  state = { hasError: false, error: "" };

  componentDidCatch(error, info) {
    console.log(info.componentStack);
    this.setState({
      hasError: true,
      error: `TypeError: ${error.message}`,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box width="100vw" height="100vh" display="flex">
          <strong style={{ margin: "auto" }}>Error!</strong>
        </Box>
      );
    }

    return (
      <>
        <Switch>
          {routes.map((route) => (
            <ProtectedRoute exact key={route.path} {...route} />
          ))}
          <Layout>
            <Route>
              <Box
                width="100%"
                height="100%"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <strong style={{ fontSize: "1.1rem" }}>404&nbsp;</strong> Page
                Not Found.
              </Box>
            </Route>
          </Layout>
        </Switch>
      </>
    );
  }
}

export default Routes;
