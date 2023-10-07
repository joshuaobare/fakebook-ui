/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/prop-types */
import { ReactComponent as LikeIcon } from "../assets/fbLike.svg";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";
import { ReactComponent as LikedIcon } from "../assets/fbLiked.svg";
import { useEffect, useState, useRef } from "react";
import Dialog from "@mui/material/Dialog";
import { Link } from "react-router-dom";
import { Close } from "@mui/icons-material";
import Comment from "./Comment";
import { format } from "date-fns";

const FullPost = (props) => {
  const [postData, setPostData] = useState({
    likes: [],
  });
  const [poster, setPoster] = useState({
    fullName: "",
  });
  const [comments, setComments] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [liked, setLiked] = useState(false);
  const [formData, setFormData] = useState({
    text: "",
    postId: props.activePostData.postId,
    userId: user._id,
  });
  const postElement = useRef(null);
  const [timestamp, setTimestamp] = useState("");

  const likePost = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/post/${postData._id}/like`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user._id }),
      }
    );
    const response = await request.json();
    console.log(response);
    fetchPost();
    setLiked((prevState) => !prevState);
  };

  const fetchPost = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/post/${props.activePostData.postId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const response = await request.json();
    setPostData(response.post[0]);
    setComments(response.comments);
  };
  const fetchPoster = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/user/${props.activePostData.userId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const response = await request.json();

    setPoster(response.user);
  };

  const handleChange = (e) => {
    setFormData((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/post/${props.activePostData.postId}/comment`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      }
    );
    const response = await request.json();

    if (response.message !== undefined) {
      setFormData({
        text: "",
        postId: props.activePostData.postId,
        userId: props.activePostData.userId,
      });
      fetchPost();
    }
  };

  useEffect(() => {
    fetchPost();
    fetchPoster();
    document.onreadystatechange = () => {
      console.log(postElement.current.clientHeight);
    };
  }, []);

  useEffect(() => {
    const hasLiked = postData.likes.some(
      (like) => like.toString() === user._id.toString()
    );

    if (hasLiked) {
      setLiked(true);
    }
    timestampHandler();
  }, [postData]);

  const commentSectionStyle = {
    minHeight: `calc(55vh - 10vh)`,
    //${postElement.current.clientHeight}px)`
  };

  const timestampHandler = async () => {
    console.log(postData);
    const dateTimestamp = new Date(await postData.timestamp);
    const now = Date.now();
    const timeDifference = (now - dateTimestamp) / 1000;

    if (timeDifference < 86400) {
      setTimestamp(
        `Today at ${format(dateTimestamp, "h")}:${format(
          dateTimestamp,
          "mm"
        )} ${format(dateTimestamp, "aa")}`
      );
    } else if (timeDifference < 604800) {
      setTimestamp(
        `${format(dateTimestamp, "EEEE")} at ${format(
          dateTimestamp,
          "h"
        )}:${format(dateTimestamp, "mm")} ${format(dateTimestamp, "aa")}`
      );
    } else if (timeDifference < 31536000) {
      setTimestamp(
        `${format(dateTimestamp, "MMMM")} ${format(
          dateTimestamp,
          "d"
        )} at ${format(dateTimestamp, "h")}:${format(
          dateTimestamp,
          "mm"
        )} ${format(dateTimestamp, "aa")}`
      );
    } else {
      setTimestamp(
        `${format(dateTimestamp, "MMMM")} ${format(
          dateTimestamp,
          "d"
        )}, ${format(dateTimestamp, "yyyy")} at ${format(
          dateTimestamp,
          "h"
        )}:${format(dateTimestamp, "mm")} ${format(dateTimestamp, "aa")}`
      );
      //setTimestamp(`${dateTimestamp.getDay()} at ${dateTimestamp.getHours() < 12 ? `${dateTimestamp.getHours()} AM `: `${dateTimestamp.getHours()} PM`}`);
    }
  };

  return (
      <Dialog open={props.postDialogOpen}>
        <div className="full-post">
          <div className="full-post-header">
            <div className="full-post-header-title">
              {poster.fullName.split(" ")[0]}'s Post
            </div>
            <div
              className="dialog-close"
              onClick={() => {
                props.dialogCloser();
                props.fetchPosts();
              }}
            >
              <Close />
            </div>
          </div>
          <div className="full-post-center">
            <div className="post-header">
              <img
                src={poster.avatar}
                alt="Poster Avatar"
                className="navbar-profile-pic"
              />
              <div className="post-header-name-section">
              <Link to={`/user/${poster._id}`}>{poster.fullName}</Link>
                <div className="post-header-timestamp">{timestamp}</div>
              </div>
            </div>
            <div className="post-text">{postData.text}</div>
            <div className="like-comment-count-section">
              <div className="like-count">
                {postData.likes.length}{" "}
                {postData.likes.length === 1 ? "like" : "likes"}
              </div>
              <div className="like-count">
                {comments.length}{" "}
                {comments.length === 1 ? "comment" : "comments"}
              </div>
            </div>
            <div className="like-comment-section">
              <div className="like-section-cont" onClick={() => likePost()}>
                {!liked ? (
                  <div className="like-section">
                    <LikeIcon />
                    <div>Like</div>
                  </div>
                ) : (
                  <div className="like-section">
                    <LikedIcon /> <div>Unlike</div>
                  </div>
                )}
              </div>
              <div className="comment-section">
                <CommentIcon />
                <div>Comment</div>
              </div>
            </div>
            <div className="full-post-comments" ref={postElement}>
              {comments.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
          </div>
          <div className="full-post-add-comment-section">
            <img
              src={user.avatar}
              alt="User Avatar"
              className="commenter-pic"
            />
            <form
              action=""
              method="post"
              className="comment-form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                placeholder="Write a comment..."
                className="full-post-comment-input"
                name="text"
                value={formData.text}
                onChange={handleChange}
              />
              <button className="create-comment-form-btn">
                <span className="material-symbols-outlined">send</span>
              </button>
            </form>
          </div>
        </div>
      </Dialog>
  );
};

export default FullPost;
