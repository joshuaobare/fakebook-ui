/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

/* eslint-disable react/no-unescaped-entities */
export default function EditProfile(props) {
  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    homeLocation: "",
  });
  const [avatar, setAvatar] = useState("");
  const [submissionError, setSubmissionError] = useState({
    fullName: "",
  });
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

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

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
    console.log(formData);
  };

  const handleEditSubmission = async (e) => {
    e.preventDefault();
    console.log({ ...formData, avatar });
    try {
      const request = await fetch(`https://patient-bush-3727.fly.dev/api/user/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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
          jobTitle: "",
          homeLocation: "",
        });
        setAvatar("");
        navigate(`/user/${id}`);
        localStorage.setItem("user", JSON.stringify(response.user))
        props.toggleUserUpdate()
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProfile = async () => {
    const request = await fetch(`https://patient-bush-3727.fly.dev/api/user/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const response = await request.json();

    if (response.user !== undefined) {
      setFormData({
        fullName: response.user.fullName,
        homeLocation: response.user.homeLocation,
        jobTitle: response.user.jobTitle,
      });
      setAvatar(response.user.avatar);
    }
  };

  useEffect(() => {
    if (id !== user._id) {
      navigate("/");
    }
    fetchProfile();
  }, []);

  return (
    <div className="sign-up edit-profile">
      <div className="sign-up-cont">
        <div className="sign-up-header">
          <div className="sign-up-header-top">Edit Profile</div>
        </div>
        <hr />
        <form
          action=""
          className="bg-white rounded px-8 pt-6 pb-8 mb-4"
          method="post"
          onSubmit={handleEditSubmission}
        >
          <div className="signup-form-item">
            <label htmlFor="fullName" className="edit-profile-label">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              placeholder="Full name"
              className="signup-input"
              value={formData.fullName}
              onChange={handleEditChange}
            />
            <span className="error-msg">{submissionError.fullName}</span>
          </div>
          <div className="signup-form-item">
            <label htmlFor="jobTitle" className="edit-profile-label">
              Job Title
            </label>
            <input
              type="text"
              name="jobTitle"
              id="jobTitle"
              placeholder="Job Title"
              value={formData.jobTitle}
              onChange={handleEditChange}
              className="signup-input"
            />
          </div>
          <div className="signup-form-item">
            <label htmlFor="homeLocation" className="edit-profile-label">
              Home Location
            </label>
            <input
              type="text"
              name="homeLocation"
              id="homeLocation"
              placeholder="Home Location"
              value={formData.homeLocation}
              onChange={handleEditChange}
              className="signup-input"
            />
          </div>

          <div className="edit-profile-avatar-section">
            <label htmlFor="avatar-input">Avatar</label>
            <img src={avatar} alt="avatar" className="edit-profile-avatar" />
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
            <button className="signup-btn">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}
