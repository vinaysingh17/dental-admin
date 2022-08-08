import React from "react";
import { useLocation } from "react-router-dom";
import { getAuth } from "../../application/reducers/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Route, Redirect } from "react-router";
import {
  actions as uiActions,
  ALERT_TYPES,
} from "../../application/reducers/uiSlice";
import { globalSelectors } from "../../application/reducers/globalSlice";
import PaginationBreadcrumbs from "../component/PaginationBreadcrumbs";
import LayoutComponent from "../component/Layout";

const ProtectedRoute = ({
  guard,
  component: Component,
  role,
  showPagination,
  layout,
  ...props
}) => {
  const auth = useSelector(getAuth);
  const location = useLocation();
  // const refreshTokenUi = useSelector(getAuthUI.refreshToken);
  const dispatch = useDispatch();
  const { selectedSubject, selectedTopic, selectedSubTopic } = useSelector(
    globalSelectors.getGlobals
  );

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
    return <Redirect to={"/login"} />;
  }

  if (role && role !== auth.role) {
    dispatch(
      uiActions.showAlert({
        type: ALERT_TYPES.INFO,
        message: "You cannot access this route.",
      })
    );
    return <Redirect to={"/login"} />;
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
