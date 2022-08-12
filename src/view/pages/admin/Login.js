import {
  Button as MuiButton,
  makeStyles,
  Paper,
  TextField,
  Typography as MuiTypography,
  CircularProgress,
} from "@material-ui/core";
import { spacing } from "@material-ui/system";
import { Formik } from "formik";
import {
  BACKEND_URL,
  DENTAL_ADMIN_TOKEN,
  DENTAL_ADMIN_USER,
} from "../../utils/formatDate";

import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import * as yup from "yup";
import {
  getAuth,
  getAuthUI,
  login,
} from "../../../application/reducers/authSlice";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  logoImg: {
    width: "100%",
    maxWidth: 250,
    display: "block",
    margin: "0 auto",
    marginBottom: "4rem",
  },
  loginDiv: {
    display: "flex",
    width: "100%",
    maxWidth: 850,
    margin: "0 auto",
    marginBottom: "2rem",

    "&>div": {
      flex: 1,
    },
  },
  loginDesignDiv: {
    background: "rgba(0, 163, 255, 0.19)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "3rem 2rem",
  },
  loginTextDiv: {
    display: "flex",
    flexDirection: "column",
    rowGap: "1rem",
    padding: "2rem",
    paddingBottom: "3rem",
  },
  signupLink: {
    marginTop: "auto",
    textDecoration: "none",
  },
}));

const Typography = styled(MuiTypography)(spacing);
const Button = styled(MuiButton)(spacing);

export default function Login() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { loading } = useSelector(getAuthUI.login);
  const { isAuth } = useSelector(getAuth);
  const history = useHistory();
  const [formValue, setFormValue] = useState({ email: "", password: "" });

  const handleSubmit = async (values) => {
    // alert("called");
    values.preventDefault();
    console.log(values);

    const { type } = await dispatch(login({ payload: formValue }));

    if (type === "auth/login/fulfilled") {
      // history.push("/");
      window.location.href = "/";
    }
  };
  const loginSubmit = async () => {
    try {
      console.log(formValue, "<<<<formVAlue");
      const { data } = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
        email: formValue.email,
        password: formValue.password,
      });
      localStorage.setItem(DENTAL_ADMIN_USER, JSON.stringify(data.data.user));
      localStorage.setItem(DENTAL_ADMIN_TOKEN, data.data.tokenRes.access_token);
      console.log("<<<type", data, "<<<daata");
      if (data.success) {
        // history.push("/");
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className={classes.root}
      style={{
        minHeight: isAuth ? "calc(100vh - 10rem)" : "calc(100vh - 2rem)",
      }}
    >
      <img
        src={require("../../assets/varlyq.png").default}
        alt=""
        className={classes.logoImg}
      />

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={yup.object({
          email: yup.string().required().email().label("Email Id"),
          password: yup.string().required().min(6).label("Password"),
        })}
        // onSubmit={handleSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          // handleBlur,
          handleSubmit,
        }) => (
          <Paper
            component={"form"}
            className={classes.loginDiv}
            variant={"elevation"}
            elevation={4}
          >
            <div className={classes.loginDesignDiv}>
              <Typography variant="h2" mb="1rem" style={{ lineHeight: 1.5 }}>
                Lorem ipsum dolor sit amet consectetur.
              </Typography>
              <Typography
                color="textPrimary"
                mb="2rem"
                style={{ lineHeight: 1.5 }}
              >
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repellat voluptas ex aperiam quam illo. Minus illum molestiae
              </Typography>
            </div>
            <div className={classes.loginTextDiv}>
              <Typography
                color="primary"
                variant="h1"
                align="center"
                mb="1.5rem"
              >
                Login
              </Typography>

              <TextField
                variant="outlined"
                id="email"
                name={"email"}
                label="Email Id"
                placeholder="Enter your email"
                value={formValue.email}
                // error={Boolean(touched.email && errors.email)}
                // helperText={touched.email && errors.email}
                // onChange={handleChange}
                onChange={(e) =>
                  setFormValue({ ...formValue, email: e.target.value })
                }
                // onBlur={handleBlur}
              />

              <TextField
                variant="outlined"
                id="password"
                name={"password"}
                label="Password"
                placeholder="Enter your password"
                value={formValue.password}
                // error={Boolean(touched.password && errors.password)}
                // helperText={touched.password && errors.password}
                // onChange={handleChange}
                onChange={(e) =>
                  setFormValue({ ...formValue, password: e.target.value })
                }
                // onBlur={handleBlur}
              />

              <Button
                // type="submit"
                onClick={loginSubmit}
                mt="2rem"
                variant="contained"
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress
                    color="inherit"
                    size="1.5rem"
                    thickness={5}
                  />
                ) : (
                  "Log In"
                )}
              </Button>
            </div>
          </Paper>
        )}
      </Formik>
    </div>
  );
}
