/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = (props) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleLoginSubmission = async (e) => {
    e.preventDefault();
    try {
      const request = await fetch("https://patient-bush-3727.fly.dev/api/login/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(formData),
      });
      const response = await request.json();

      if (response.token !== undefined) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", response.user);
        setLoginError(false);
        props.loginHandler();
      }
    } catch (err) {
      setLoginError(true);
    }
  };

  const guestLogin = async (e) => {
    e.preventDefault();
    try {
      const request = await fetch("https://patient-bush-3727.fly.dev/api/login/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ username: "testerProfile", password: "random" }),
      });
      const response = await request.json();
      console.log(response);

      if (response.token !== undefined) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", response.user);
        setLoginError(false);
        props.loginHandler();
      }
    } catch (err) {
      setLoginError(true);
    }
  };

  return (
    <div className="login">
      <div className="login-left">
        <div className="login-left-header">fakebook</div>
        <h2 className="login-left-bottom">Fakebook helps you connect and share with the people in your life</h2>
      </div>
      <div>
        <form action="" method="post" onSubmit={handleLoginSubmission} className="login-form">
          <div>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              className="login-input"
              onChange={handleLoginChange}
              placeholder="Username"
            />
            <span className="error-msg"></span>
          </div>
          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              className="login-input"
              id="password"
              onChange={handleLoginChange}
              placeholder="Password"
            />
            <span className="error-msg"></span>
          </div>

          <div>
            <button className="login-btn" type="submit">Log In</button>
          </div>
          <button className="guest-login-button" onClick={guestLogin}>Guest Login</button>
          <div>{loginError ? "Invalid credentials, try again" : ""}</div>
          <Link to='signup'>
            <button className="login-signup-btn">Create Account</button>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
