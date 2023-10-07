/* eslint-disable react/prop-types */
import { useState } from "react";

const CreatePost = (props) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    userId: user._id,
    text: "",
  });

  const handleChange = (e) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();    
    const request = await fetch("https://patient-bush-3727.fly.dev/api/post", {
      method: "POST",
      headers: {
        "Content-type": "application/json",       
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const response = await request.json();
    
    if (response.message !== undefined) {
      setFormData({
        userId: user._id,
        text: "",
      });
      props.fetchPosts()
    }
  };

  return (
    <div className="homepage-create-post">
      <img
        src={user.avatar}
        alt="Profile Pic Icon"
        className="navbar-profile-pic"
      />
      <form action="" className="create-post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`What's on your mind, ${user.fullName.split(" ")[0]}?`}
          className="homepage-create-post-input"
          name="text"
          onChange={handleChange}
          value={formData.text}
        />
        <button className="create-post-form-btn">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
