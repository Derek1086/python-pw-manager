import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import LoadingIndicator from "./LoadingIndicator";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CustomFilledInput from "./CustomFilledInput";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState({
    open: false,
    message: "Invalid username or pw",
    severity: "success",
  });
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      if (method === "register") {
        if (password !== confirmPassword) {
          setLoginError({
            open: true,
            message: "Passwords do not match",
            severity: "error",
          });
          console.log("Passwords don't match");
          return;
        }

        // Password validation criteria
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d|\W).{8,}$/;

        if (!passwordRegex.test(password)) {
          setLoginError({
            open: true,
            message: "Password does not meet criteria",
            severity: "error",
          });
          console.log("Invalid password");
          return;
        }
      }

      const res = await api.post(route, { username, password });

      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }
      setLoginError({
        open: false,
        message: "Invalid username or password",
        severity: "error",
      });
    } catch (error) {
      console.log(error);
      setLoginError({
        open: true,
        message: "Invalid username or password",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card style={{ margin: "50px auto", padding: "20px", maxWidth: "500px" }}>
        <form
          style={{ backgroundColor: "transparent" }}
          onSubmit={handleSubmit}
        >
          <Stack spacing={3}>
            <Typography
              style={{
                paddingBottom: "20px",
                textAlign: "center",
                marginTop: "20px",
              }}
              variant="h4"
              className="form-label"
            >
              {name}
            </Typography>
            <CustomFilledInput
              type="username"
              id="filled-adornment-user"
              value={username}
              error={loginError.open === true}
              content="Username"
              onChange={setUsername}
            />
            <CustomFilledInput
              type="password"
              id="filled-adornment-password"
              value={password}
              error={loginError.open === true}
              content="Password"
              onChange={setPassword}
            />
            {name === "Register" && (
              <>
                <Typography
                  style={{
                    textAlign: "left",
                  }}
                  variant="body1"
                  className="form-label"
                >
                  Password must include:
                </Typography>
                <ul>
                  <li>At least 8 characters</li>
                  <li>At least 1 uppercase character</li>
                  <li>At least 1 lowercase character</li>
                  <li>At least 1 number or special character</li>
                </ul>
                <CustomFilledInput
                  type="password"
                  id="filled-adornment-confirm-password"
                  value={confirmPassword}
                  error={loginError.open === true}
                  content="Password Confirmation"
                  onChange={setConfirmPassword}
                />
              </>
            )}
            {loading && <LoadingIndicator />}
            <Button
              style={{ width: "100%" }}
              color="secondary"
              variant="contained"
              className="form-button"
              type="submit"
            >
              {name}
            </Button>
            {name === "Login" ? (
              <>
                <Typography
                  style={{
                    textAlign: "center",
                  }}
                  variant="body2"
                  className="form-label"
                  color="GrayText"
                >
                  New user?
                </Typography>
                <Button
                  style={{ marginTop: "20px", width: "100%" }}
                  color="secondary"
                  variant="outlined"
                  className="form-button"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </>
            ) : (
              <>
                <Typography
                  style={{
                    textAlign: "center",
                  }}
                  variant="body2"
                  className="form-label"
                  color="GrayText"
                >
                  Existing user?
                </Typography>
                <Button
                  style={{ marginTop: "20px", width: "100%" }}
                  color="secondary"
                  variant="outlined"
                  className="form-button"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
              </>
            )}
          </Stack>
        </form>
      </Card>
      <Snackbar
        open={loginError.open === true}
        autoHideDuration={3000}
        onClose={() =>
          setLoginError({
            open: false,
            message: "Password's do not match",
            severity: "error",
          })
        }
      >
        <Alert
          onClose={() =>
            setLoginError({
              open: false,
              message: "Password's do not match",
              severity: "error",
            })
          }
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {loginError.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default Form;
