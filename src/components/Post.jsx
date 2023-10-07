/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as LikeIcon } from "../assets/fbLike.svg";
import { ReactComponent as LikedIcon } from "../assets/fbLiked.svg";
import { ReactComponent as CommentIcon } from "../assets/comment.svg";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import { Close } from "@mui/icons-material";
import { format } from "date-fns";
//import Comment from "./Comment";

const Post = (props) => {
  const [poster, setPoster] = useState({});
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const [loading, setLoading] = useState(true);

  const likePost = async (refresh) => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/post/${props.post._id}/like`,
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

    if (response.message === "liked post") {
      setLiked(true);
    } else {
      setLiked(false);
    }
    refresh();
    //
  };

  const fetchPoster = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/user/${props.post.userId}`,
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
  const fetchComments = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/post/${props.post._id}/comments`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const response = await request.json();
    setComments([...response.comments]);
  };

  const likeChecker = () => {
    const hasLiked = props.post.likes.some(
      (like) => like.toString() === user._id.toString()
    );

    if (hasLiked) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  };

  const userCheck = () => {
    if (user._id === props.post.userId) {
      setCurrentUserProfile(true);
    }
  };
  const deleteDialogHandler = () => {
    setDeleteDialogOpen((prevState) => !prevState);
  };

  const deletePost = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/post/${props.post._id}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const response = await request.json();
    setDeleteDialogOpen(false);
    props.fetchPosts();
  };

  const timestampHandler = () => {
    const dateTimestamp = new Date(props.post.timestamp);
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

  useEffect(() => {
    try {
      fetchPoster();
      fetchComments();
      likeChecker();
      userCheck();
      timestampHandler();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
    likeChecker();
    userCheck();
  }, [props.activePostData]);

  return loading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <div className="post">
      <Dialog open={deleteDialogOpen}>
        <div className="profile-friend-dialog">
          <div
            onClick={deleteDialogHandler}
            className="profile-friend-dialog-top"
          >
            <Close />
          </div>
          <div className="profile-friend-dialog-mid">Are you sure?</div>
          <button onClick={deletePost} className="remove-friend-btn">
            Delete Post
          </button>
        </div>
      </Dialog>
      <div className="post-header">
        <img
          src={poster.avatar}
          alt="User Avatar"
          className="navbar-profile-pic"
        />
        <div className="post-header-name-section">
          <div className="post-header-username">
            <Link to={`/user/${props.post.userId}`}>{poster.fullName}</Link>
          </div>
          <div className="post-header-timestamp">{timestamp}</div>
        </div>
        {currentUserProfile ? (
          <div className="delete-post-icon" onClick={deleteDialogHandler}>
            <DeleteIcon />
          </div>
        ) : null}
      </div>
      <hr />
      <div className="post-text">{props.post.text}</div>
      <div className="like-comment-count-section">
        <div className="like-count">
          {props.post.likes.length}{" "}
          {props.post.likes.length === 1 ? "like" : "likes"}
        </div>
        <div
          onClick={() =>
            props.dialogHandler({
              postId: props.post._id,
              userId: props.post.userId,
            })
          }
          className="comment-count"
        >
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </div>
      </div>

      <div className="like-comment-section">
        <div
          className="like-section-cont"
          onClick={() => likePost(props.fetchPosts)}
        >
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
        <div
          className="comment-section"
          onClick={() =>
            props.dialogHandler({
              postId: props.post._id,
              userId: props.post.userId,
            })
          }
        >
          <CommentIcon />
          <div>Comment</div>
        </div>
      </div>
    </div>
  );
};

export default Post;
