import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const Comment = (props) => {
  const [commenter, setCommenter] = useState({})
  const [timestamp, setTimestamp] = useState("");

  const fetchUser = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/user/${props.comment.userId}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const response = await request.json();

    setCommenter(response.user);
  };

  useEffect(()=>{
    fetchUser()
    timestampHandler()
  },[])

  const timestampHandler = () => {
    
    const dateTimestamp = new Date(props.comment.timestamp);
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
    <div className="comment">
      <img src={commenter.avatar} className="navbar-profile-pic" alt="Commenter Avatar" />
      <div>
        <div className="comment-name"><Link to={`/user/${commenter._id}`}>{commenter.fullName}</Link></div>
        <div className="post-header-timestamp">{timestamp}</div>
        <div>{props.comment.text}</div>
      </div>
    </div>
  );
};

export default Comment;
