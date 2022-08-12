import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAuth } from "../../application/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Route, Redirect } from "react-router";
import { useHistory } from "react-router-dom";

import {
  actions as uiActions,
  ALERT_TYPES,
} from "../../application/reducers/uiSlice";
import { globalSelectors } from "../../application/reducers/globalSlice";
import PaginationBreadcrumbs from "../component/PaginationBreadcrumbs";
import LayoutComponent from "../component/Layout";
import { DENTAL_ADMIN_USER } from "../utils/formatDate";
import { useState } from "react";

const ProtectedRoute = ({
  guard,
  component: Component,
  role,
  showPagination,
  layout,
  ...props
}) => {
  console.log(props, "<<<<props");
  const auth = useSelector(getAuth);
  const location = useLocation();
  // const userData = localStorage.getItem(DENTAL_ADMIN_USER);
  // const refreshTokenUi = useSelector(getAuthUI.refreshToken);
  const history = useHistory();
  const dispatch = useDispatch();
  const { selectedSubject, selectedTopic, selectedSubTopic } = useSelector(
    globalSelectors.getGlobals
  );
  const [loginState, setLoginState] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem(DENTAL_ADMIN_USER);
    console.log(user, "<<<<this is user");
    setLoginState(user);
    if (user == null || user == "null") {
      // window.location.href = "/login";
      history.push("/login");
    }
  }, []);

  // if (refreshTokenUi.loading)
  //   return (
  //     <div
  //       style={{
  //         display: "flex",
  //         width: "100%",
  //         height: "calc(100vh - 80px - 2rem)",
  //       }}
  //     >
  //       <CircularProgress
  //         style={{ margin: "auto" }}
  //         size="2.3rem"
  //         thickness={5}
  //       />
  //     </div>
  //   );
  // -----------------------------------------------------

  if (guard && !auth.isAuth) {
    // if (loginState == null) {
    // return <Redirect to={"/login"} />;
  }

  if (role && role !== auth.role) {
    // if (userData == null) {
    dispatch(
      uiActions.showAlert({
        type: ALERT_TYPES.INFO,
        message: "You cannot access this route.",
      })
    );
    // return <Redirect to={"/login"} />;
  }
  // ------------------------------------------------------------------------

  // all auth validations success here...

  switch (location.pathname) {
    case "/subject":
    case "/subject/":
      break;

    case "/topic":
    case "/topic/":
      if (!selectedSubject) {
        dispatch(
          uiActions.showAlert({
            type: ALERT_TYPES.INFO,
            message: "Please select a Subject.",
          })
        );
        return <Redirect to="/subject" />;
      }
      break;

    case "/subTopic":
    case "/subTopic/":
      if (!selectedTopic) {
        dispatch(
          uiActions.showAlert({
            type: ALERT_TYPES.INFO,
            message: "Please select a Topic.",
          })
        );
        return <Redirect to="/topic" />;
      }
      break;

    default:
      break;
  }

  const Layout = layout ? LayoutComponent : React.Fragment;
  if (props.path == "/login") {
    return (
      <Route exact {...props}>
        {/* <Layout> */}
        {showPagination && <PaginationBreadcrumbs />}
        <Component />
        {/* </Layout> */}
      </Route>
    );
  }
  return (
    <Route exact {...props}>
      <Layout>
        {showPagination && <PaginationBreadcrumbs />}
        <Component />
      </Layout>
    </Route>
  );
};

export default ProtectedRoute;
