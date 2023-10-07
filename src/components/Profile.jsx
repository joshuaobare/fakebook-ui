/* eslint-disable react/prop-types */
import locationlogo from "../assets/locationlogo.png";
import worklogo from "../assets/worklogo.png";
import rellogo from "../assets/rellogo.png";
import clocklogo from "../assets/clock.png";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { Close } from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
import Post from "./Post";
import { format } from "date-fns";
import FullPost from "./FullPost";

const Profile = (props) => {
  const { id } = useParams();
  const [profile, setProfile] = useState({
    friends: [],
    friendRequests: [],
  });
  const [posts, setPosts] = useState([]);
  const [currentUserProfile, setCurrentUserProfile] = useState(false);
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [friendDialogOpen, setFriendDialogOpen] = useState(false);
  const [joinedAt, setJoinedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchPosts = async () => {
    const request = await fetch(`https://patient-bush-3727.fly.dev/api/user/${id}/posts`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const response = await request.json();
    setPosts(response.posts);
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
    setProfile(response.user);
  };

  const userCheck = () => {
    if (user._id === id) {
      setCurrentUserProfile(true);
    }
  };

  const friendsCheck = () => {
    const check = profile.friends.some((friend) => friend === user._id);

    if (check) {
      setIsFriend(true);
    } else {
      setIsFriend(false);
    }
  };

  const requestCheck = () => {
    const check = profile.friendRequests.some((friend) => friend === user._id);

    if (check) {
      setRequestSent(true);
    } else {
      setRequestSent(false);
    }
  };
  const style = {
    backgroundImage: `url(${profile.avatar})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };

  const sendRequest = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/friend/${id}/request`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user._id, friendId: profile._id }),
      }
    );

    const response = await request.json();
    console.log(response);
    fetchProfile();
  };

  const friendDialogHandler = () => {
    setFriendDialogOpen((prevState) => !prevState);
  };

  const removeFriend = async () => {
    const request = await fetch(
      `https://patient-bush-3727.fly.dev/api/friend/${id}/remove`,
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ userId: user._id, friendId: profile._id }),
      }
    );

    const response = await request.json();
    setFriendDialogOpen(false);
    fetchProfile();
  };
  const dateSetter = async () => {
    const date = new Date(await profile.joinedAt);
    setJoinedAt(`${format(date, "MMMM")} ${format(date, "yyyy")}`);
  };

  useEffect(() => {
    try {
      fetchPosts();
      fetchProfile();
      userCheck();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    friendsCheck();
    requestCheck();
    console.log(profile);
    dateSetter();
  }, [profile]);

  return loading ? (
    <div>
      <CircularProgress />
    </div>
  ) : (
    <div className="profile">
      {props.postDialogOpen ? (
        <FullPost
          postDialogOpen={props.postDialogOpen}
          dialogCloser={props.dialogCloser}
          activePostData={props.activePostData}
        />
      ) : null}
      <Dialog open={friendDialogOpen}>
        <div className="profile-friend-dialog">
          <div
            onClick={friendDialogHandler}
            className="profile-friend-dialog-top"
          >
            <Close />
          </div>
          <div className="profile-friend-dialog-mid">Are you sure?</div>
          <button onClick={removeFriend} className="remove-friend-btn">
            Remove Friend
          </button>
        </div>
      </Dialog>
      <div className="profile-cont">
        <div className="profile-top">
          {/* <div className="profile-cover" style={style}></div> */}
          <div className="profile-header-cont">
            <div className="profile-header">
              <img
                src={profile.avatar}
                alt="Profile Picture"
                className="profile-pic"
              />
              <div className="profile-header-right">
                <h1 className="profile-header-username">{profile.fullName}</h1>
                <div className="profile-header-friend-count">
                  {profile.friends.length} friends
                </div>
              </div>
            </div>
            <div>
              {currentUserProfile ? (
                <button className="edit-profile-btn" style={{ color: "white" }}>
                  <Link to={`/user/${profile._id}/edit`}>Edit Profile</Link>
                </button>
              ) : requestSent ? (
                <button className="requested-btn" disabled>
                  Request Pending
                </button>
              ) : !isFriend ? (
                <button onClick={sendRequest} className="add-friend-btn">
                  Add Friend
                </button>
              ) : (
                <button
                  onClick={friendDialogHandler}
                  className="remove-friend-btn"
                >
                  Remove Friend
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="profile-bottom">
          <div className="profile-bottom-intro">
            <div className="profile-intro-header">Intro</div>
            <div className="profile-intro-item">
              <img src={worklogo} alt="" className="profile-intro-icon" />
              {profile.jobTitle}
            </div>
            <div className="profile-intro-item">
              {" "}
              <img src={locationlogo} alt="" className="profile-intro-icon" />
              <span className="profile-intro-span">From</span>{" "}
              {profile.homeLocation}
            </div>
            <div className="profile-intro-item">
              {" "}
              <img src={rellogo} alt="" className="profile-intro-icon" />{" "}
              {profile.relationshipStatus}
            </div>
            <div className="profile-intro-item">
              {" "}
              <img src={clocklogo} alt="" className="profile-intro-icon" />
              <span className="profile-intro-span">Joined</span> {joinedAt}
            </div>
          </div>
          <div className="profile-posts-section">
            {posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                dialogHandler={props.dialogHandler}
                fetchPosts={fetchPosts}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
