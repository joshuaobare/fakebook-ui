import { useState } from "react";

/* eslint-disable react/no-unescaped-entities */
function SignUp() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState("");
  const [submissionError, setSubmissionError] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
    });
  }

  const handleAvatar = async (e) => {
    setAvatar(await convertToBase64(e.target.files[0]));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
    console.log(formData);
  };

  const handleSignUpSubmission = async (e) => {
    e.preventDefault();
    console.log({ ...formData, avatar });
    try {
      const request = await fetch("https://patient-bush-3727.fly.dev/api/user/", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...formData, avatar }),
      });
      const response = await request.json();
      console.log(response);

      if (response.errors) {
        response.errors.forEach((error) => {
          setSubmissionError((prevState) => {
            return { ...prevState, [error.path]: error.msg };
          });
        });
      } else {
        setFormData({
          fullName: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setAvatar("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="sign-up">
      <div className="sign-up-cont">
        <div className="sign-up-header">
          <div className="sign-up-header-top">Sign Up</div>
          <div className="sign-up-header-bottom">It's quick and easy</div>
        </div>
        <hr />
        <form
          action=""
          className="bg-white rounded px-8 pt-6 pb-8 mb-4"
          method="post"
          onSubmit={handleSignUpSubmission}
        >
          <div className="signup-form-item">            
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full name"
              className="signup-input"
              value={formData.fullName}
              onChange={handleSignUpChange}
            />
            <span className="error-msg">{submissionError.fullName}</span>
          </div>
          <div className="signup-form-item">            
            <input
              type="text"
              name="username"
              className="signup-input"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleSignUpChange}
            />
            <span className="error-msg">{submissionError.username}</span>
          </div>
          <div className="signup-form-item">            
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleSignUpChange}
              className="signup-input"
            />
            <span className="error-msg">{submissionError.email}</span>
          </div>
          <div className="signup-form-item">            
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="signup-input"
              id="password"
              value={formData.password}
              onChange={handleSignUpChange}
            />
            <span className="error-msg">{submissionError.password}</span>
          </div>
          <div className="signup-form-item">            
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm Password"
              className="signup-input"
              value={formData.confirmPassword}
              onChange={handleSignUpChange}
            />
            <span className="error-msg">{submissionError.confirmPassword}</span>
          </div>

          <div>
            <label htmlFor="avatar-input">Avatar</label>
            <div
              className="flex items-center justify-center w-full"
              id="avatar-input-cont"
            >
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    SVG, PNG, JPG or GIF
                  </p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  accept=".jpg, .png, .jpeg, .gif"
                  className="hidden"
                  name="avatar"
                  onChange={handleAvatar}
                />
              </label>
            </div>
          </div>
          <div className="signup-btn-cont">
            <button className="signup-btn">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
